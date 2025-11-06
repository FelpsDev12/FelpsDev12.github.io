
const auth_container = document.querySelector('.auth_container');
const username_input = document.getElementById('username_input');
const main = document.querySelector('main');
const input_message = document.getElementById('input_message');
const send_message = document.getElementById("send_message");
const input_box = document.querySelector('.input_box');
const messages_box = document.querySelector('.messages_box');
const btn_login = document.getElementById('btn_login');
const user_data = document.querySelector('.user_data');
const loveable_icon = document.getElementById('loveable_icon_svg');
const love_box = document.querySelector('.love_box');

const WS_URL = 'wss://backend-loveable.onrender.com';
const API_URL = 'https://backend-loveable.onrender.com';

let user = null;
let ws = null;
let replyToMessage = null;
let audioCooldown = false;
let startX = 0;
let swipingElem = null;

const colors = ['#ffcc00', '#8505da', '#008000', '#00ffe5', '#ff4500', '#bbff00'];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function cortarText(text, maxLength = 40) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength).trim() + '…' : text;
}

const createSelfElement = (username, userColor, message, replyToText = null, replyToId = null) => {
  const section = document.createElement('section');
  section.classList.add('message_self');
  if (replyToId) section.dataset.replyTo = replyToId;

  section.innerHTML = `
    <p class="username" style='color: ${userColor};'>${username}</p>
    ${replyToText ? `<div class="reply_to" title="Ver mensagem original"><span>Respondendo a:</span> ${escapeHtml(cortarText(replyToText, 35))}</div>` : ""}
    <p class="message">${escapeHtml(message)}</p>
  `;

  const replyElem = section.querySelector('.reply_to');
  if (replyElem && replyToId) {
    replyElem.addEventListener('click', () => scrollToOriginalMessage(replyToId));
  }

  return section;
};

const createOtherElement = (username, userColor, message, replyToText = null, replyToId = null) => {
  const section = document.createElement('section');
  section.classList.add('message_other');
  if (replyToId) section.dataset.replyTo = replyToId;

  section.innerHTML = `
    <p class="username" style='color: ${userColor};'>${username}</p>
    ${replyToText ? `<div class="reply_to" title="Ver mensagem original"><span>Respondendo a:</span> ${escapeHtml(cortarText(replyToText, 35))}</div>` : ""}
    <p class="message">${escapeHtml(message)}</p>
  `;

  const replyElem = section.querySelector('.reply_to');
  if (replyElem && replyToId) {
    replyElem.addEventListener('click', () => scrollToOriginalMessage(replyToId));
  }

  return section;
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function scrollToOriginalMessage(replyToId) {
  const original = document.querySelector(`[data-message-id="${replyToId}"]`);
  if (!original) {
    alert('Mensagem original não encontrada (pode ter sido removida).');
    return;
  }

  original.scrollIntoView({ behavior: 'smooth', block: 'center' });

  original.classList.add('highlight');
  setTimeout(() => original.classList.remove('highlight'), 2000);
}


async function carregarMensagens() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const res = await fetch(`${API_URL}/chat/get-mensagens`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Erro carregar mensagens:', data);
      return alert('Falha ao carregar mensagens');
    }

    messages_box.innerHTML = '';

    const messagesById = {};
    data.forEach(m => messagesById[m._id] = m);

    data.forEach(msg => {
      const isSelf = String(msg.userId) === String(userId);
      const replyToText = msg.replyTo ? (messagesById[msg.replyTo]?.content || '[mensagem removida]') : null;

      const element = isSelf
        ? createSelfElement(msg.username, getRandomColor(), msg.content, replyToText)
        : createOtherElement(msg.username, getRandomColor(), msg.content, replyToText);

      element.dataset.messageId = msg._id;
      messages_box.appendChild(element);
    });

    messages_box.scrollTo({ top: messages_box.scrollHeight, behavior: 'smooth' });

  } catch (err) {
    console.error('Erro ao carregar mensagens:', err);
    alert('Erro ao carregar mensagens (ver console)');
  }
}

const processMessage = ({ data }) => {
   try {
    const parsed = JSON.parse(data);
    const senderId = parsed.userId ?? parsed.userId;
    const username = parsed.username ?? parsed.user;
    const userColor = parsed.userColor ?? getRandomColor();
    const messageText = parsed.message ?? parsed.content ?? '';

    if (!messageText) return;

    const replyToText = parsed.replyToText ? cortarText(parsed.replyToText, 20) : null;
const replyToId = parsed.replyTo || null;

const element = String(senderId) === String(user?.id)
  ? createSelfElement(username, userColor, messageText, replyToText, replyToId)
  : createOtherElement(username, userColor, messageText, replyToText, replyToId);

    messages_box.appendChild(element);
    element.dataset.messageId = parsed._id || crypto.randomUUID();

    if (parsed._id) {
      element.dataset.messageId = parsed._id;
    } else {
      element.dataset.messageId = crypto.randomUUID();
    }

    if (/amo+/i.test(messageText)) {
      love_box.style.display = '';
      setTimeout(() => { love_box.style.display = 'none'; }, 2500);
    }

    if (!audioCooldown && String(senderId) !== String(user?.id) && messageText.trim() !== '') {
      const audio = new Audio('../assets/loveable_message.mp3');
      audio.volume = 1.0;
      audio.play().catch(e => {});
      audioCooldown = true;
      setTimeout(() => (audioCooldown = false), 700);
    }

    messages_box.scrollTo({ top: messages_box.scrollHeight, behavior: 'smooth' });

  } catch (err) {
    console.error('Erro ao processar mensagem WS:', err);
  }
};

const sendMessage = async () => {
  const content = input_message.value.trim();
  if (!content) return;

const wsPayload = {
  userId: user.id,
  username: user.name,
  userColor: user.color,
  message: content,
  replyTo: replyToMessage ? replyToMessage.id : null,
  replyToText: replyToMessage ? replyToMessage.text : null
};


  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(wsPayload));
  }

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}/chat/postar-mensagem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        replyTo: replyToMessage ? replyToMessage.id : null
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Erro POST /chat/postar-mensagem:', data);
      return alert('Erro ao enviar mensagem');
    }

    const saved = data?.data ?? data;
    if (saved && saved._id) {
      const lastMsg = messages_box.lastElementChild;
      if (lastMsg && (!lastMsg.dataset.messageId || lastMsg.dataset.messageId.startsWith('temp-') || lastMsg.dataset.messageId.length === 36)) {
        lastMsg.dataset.messageId = saved._id;
      }
    }

    input_message.value = '';
    replyToMessage = null;
    document.querySelector('.reply_preview')?.remove();

  } catch (err) {
    console.error('Erro ao postar mensagem:', err);
    alert('Erro ao enviar mensagem (ver console)');
  }
};

messages_box.addEventListener('dblclick', (e) => {
  const msg = e.target.closest('.message_other, .message_self');
  if (!msg) return;

  const username = msg.querySelector('.username')?.textContent || '...';
  const text = msg.querySelector('.message')?.textContent || '';
  const id = msg.dataset.messageId || null;

  replyToMessage = { id, username, text };

  showReplyPreview(username, text);
});

function showReplyPreview(username, text) {
  let replyPreview = document.querySelector('.reply_preview');
  if (!replyPreview) {
    replyPreview = document.createElement('div');
    replyPreview.className = 'reply_preview';
    input_box.prepend(replyPreview);
  }
 replyPreview.innerHTML = `
 <div class='juntarReplyPreview'>
  <b>Respondendo a ${escapeHtml(username)}:</b>
  <i>${escapeHtml(cortarText(text, 15))}</i>
  </div>
  <a class="cancel_reply" title="Cancelar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="red"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a>
`;
  const btn = replyPreview.querySelector('.cancel_reply');
  btn.addEventListener('click', () => {
    replyPreview.remove();
    replyToMessage = null;
  });
}

async function getOtherStatus() {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await fetch(`${API_URL}/status/get-other-status`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return;
    const data = await res.json();
    localStorage.setItem('partnerUsername', data.username);
    localStorage.setItem('status', data.status ? 'true' : 'false');
  } catch (err) {
    console.error('Erro getOtherStatus:', err);
  }
}

function setStatus() {
  const getStatus = localStorage.getItem('status');
  const getUsername = localStorage.getItem('partnerUsername');

  if (!user_data || !loveable_icon) return;

  user_data.style.display = '';

  if (getStatus === 'true') {
    loveable_icon.style.fill = '#04ff04';
    user_data.innerHTML = `
      <p class="user_status">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#04ff04">
          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763
          q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5
          156T763-197q-54 54-127 85.5T480-80Z"/>
        </svg>
      </p>
      <a class="user_username" style='color:var(--branco_claro)'>
        ${getUsername || 'Desconhecido'}
      </a>
    `;
  } else {
    loveable_icon.style.fill = 'orangered';
    user_data.innerHTML = `
      <p class="user_status">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="orangered">
          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763
          q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5
          156T763-197q-54 54-127 85.5T480-80Z"/>
        </svg>
      </p>
      <a class="user_username" style='color:var(--branco_claro)'>
        ${getUsername || 'Desconhecido'}
      </a>
    `;
  }
}

async function autoLogin() {
  const savedToken = localStorage.getItem('token');
  if (!savedToken) return;
  try {
    const res = await fetch(`${API_URL}/auth/get-data`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    user = { id: data.userId, name: data.username, color: getRandomColor() };

    auth_container.style.display = 'none';
    main.style.display = '';

    if (ws) ws.close();
    ws = new WebSocket(`${WS_URL}?token=${savedToken}`);

    ws.onopen = async () => {
      try {
        await fetch(`${API_URL}/status/status-online`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${savedToken}`
          }
        });
      } catch (err) { console.error(err); }
    };

    ws.onmessage = processMessage;
    console.log('Login automático:', user);

    await carregarMensagens();
  } catch (err) {
    console.error('Erro autoLogin:', err);
  }
}

btn_login.addEventListener('click', async () => { await Login(); });
send_message.addEventListener('click', sendMessage);

input_message.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

window.addEventListener("beforeunload", async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    await fetch(`${API_URL}/status/status-offline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('Erro ao desconectar:', err);
  }
});

setInterval(getOtherStatus, 3000);
setInterval(setStatus, 1000);

window.addEventListener('load', async () => {
  await autoLogin();
  await getOtherStatus();
  setStatus();

  const picker = new EmojiMart.Picker({
    onEmojiSelect: emoji => {
      input_message.value += emoji.native;
    }
  });

  const pickerDiv = document.querySelector('.emoji-picker-div');
  pickerDiv.appendChild(picker);

  const shadowRoot = picker.shadowRoot;
  if (shadowRoot) {
    const removePreview = () => {
      const preview = shadowRoot.querySelector('#preview');
      if (preview) preview.style.display = 'none';
    };
    removePreview();

    const observer = new MutationObserver(removePreview);
    observer.observe(shadowRoot, { childList: true, subtree: true });
  }

  const botao = document.getElementById('emoji-picker');
  botao.addEventListener('click', () => {
    const visible = getComputedStyle(pickerDiv).display !== 'none';
    pickerDiv.style.display = visible ? 'none' : '';
  });
});

messages_box.addEventListener('click', async () => {
  const pickerDiv = document.querySelector('.emoji-picker-div');
  if (pickerDiv.style.display === '') {
    pickerDiv.style.display = 'none'
  }
})


