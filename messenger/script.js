const auth_container = document.querySelector('.auth_container')
const username_input = document.getElementById('username_input')
const main = document.querySelector('main')
const input_message = document.getElementById('input_message')
const input_box = document.querySelector('.input_box')
const message_self = document.querySelector('.message_self')
const message_self_content = document.querySelector('.message_self')
const messages_box = document.querySelector('.messages_box')
const btn_login = document.getElementById('btn_login')
const getUserId = localStorage.getItem('userId')
const user_data = document.querySelector('.user_data')
const loveable_icon = document.getElementById('loveable_icon_svg')

const API_URL = 'https://backend-loveable.onrender.com'
let user

const colors = [
  '#ffcc00',
  '#8505da',
  '#008000',
  '#00ffe5',
  '#ff4500',
  '#bbff00',
]

async function carregarMensagens() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const res = await fetch(`${API_URL}/chat/get-mensagens`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    return alert('Falha ao carregar mensagens');
  }

  data.forEach(message => {
    const isSelf = String(message.userId) === String(userId);

    const element = isSelf
      ? createSelfElement(message.username, getRandomColor(), message.content)
      : createOtherElement(message.username, getRandomColor(), message.content);

    messages_box.appendChild(element);
  });

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

function setStatus() {
  const getStatus = localStorage.getItem('status')
  const getUsername = localStorage.getItem('partnerUsername')

  if (getStatus === 'true') {
    loveable_icon.style.fill = '#04ff04'
    user_data.innerHTML = `
    <p class="user_status"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#04ff04"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg></p>
    <a class="user_username" style='color:var(--branco_claro)';>${getUsername}</a>
    `
  } else {
    loveable_icon.style.fill = 'orangered'
    user_data.innerHTML = `
    <p class="user_status"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="orangered"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg></p>
    <a class="user_username" style='color:var(--branco_claro)';>${getUsername}</a>
    `
  }
}

async function Login() {
  const username = username_input.value.trim()

  if (!username) return alert('Digite um nome para logar')

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  })

  const data = await res.json()

  if (!res.ok) {
    return alert(data.error);
  }

  user = {
    id: data.userId,
    name: username,
    color: getRandomColor(),
  }


  localStorage.setItem('token', data.token)

  const userId = data.userId
  localStorage.setItem('userId', userId)

  auth_container.style.display = 'none'
  main.style.display = ''

  ws = new WebSocket('ws://localhost:3000');
  ws.onmessage = processMessage;
}

async function Register() {
  try {
    const username = username_input.value.trim();
    if (!username) return alert("Digite um nome de usuário");

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);

    user = {
      id: data.userId,
      name: username,
      color: getRandomColor(),
    };

    alert(data.message);

    auth_container.style.display = "none";
    main.style.display = "";
    ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = processMessage;

  } catch (error) {
    console.error(error);
    alert("Erro de comunicação com Backend");
  }
}


let ws

function getRandomColor() {
  const randomColor = Math.floor(Math.random() * colors.length)
  return colors[randomColor]
}

const createSelfElement = (username, userColor, message) => {
  const section = document.createElement('section')
  const span = document.createElement('p')

  section.classList.add('message_self')
  span.classList.add('message')

  section.innerHTML = `
  <p class="username" style='color: ${userColor};'>${username}</p>
  <p class="message">${message}</p>
  `

  return section
}

const createOtherElement = (username, userColor, message) => {
  const section = document.createElement('section')
  const span = document.createElement('p')

  section.classList.add('message_other')
  span.classList.add('message')

  section.innerHTML = `
  <p class="username" style='color: ${userColor};'>${username}</p>
  <p class="message">${message}</p>
  `

  return section
}

const processMessage = ({ data }) => {

  const userId = localStorage.getItem('userId')
  const { userId: senderId, username, userColor, message } = JSON.parse(data)

  let element;

  if (senderId === user.id) {
    element = createSelfElement(username, userColor, message)
  } else {
    element = createOtherElement(username, userColor, message)
  }


  messages_box.appendChild(element)

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })

}

const sendMessage = async (event) => {
  event.preventDefault()

  const message = {
    userId: user.id,
    username: user.name,
    userColor: user.color,
    message: input_message.value
  }

  ws.send(JSON.stringify(message))

  const token = localStorage.getItem('token')
  const content = input_message.value

  const res = await fetch(`${API_URL}/chat/postar-mensagem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });

  const data = await res.json()

  if (!res.ok) {
    return alert(data.error);
  }

  input_message.value = ''

}

async function getOtherStatus() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/status/get-other-status`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    return console.log('Erro ao obter status do parceiro');
  }

  const data = await res.json()

  localStorage.setItem('partnerUsername', data.username)

  if (data.status === false) {
    localStorage.setItem('status', 'false')
  } else {
    localStorage.setItem('status', 'true')
  }

}

async function autoLogin() {
  const savedToken = localStorage.getItem('token');

  if (savedToken) {
    try {
      const res = await fetch(`${API_URL}/auth/get-data`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();

      user = {
        id: data.userId,
        name: data.username,
        color: getRandomColor(),
      };

      auth_container.style.display = 'none';
      main.style.display = '';

      ws = new WebSocket('ws://localhost:3000');

      ws.onopen = async () => {
        const token = localStorage.getItem('token');

        try {
          const res = await fetch(`${API_URL}/status/status-online`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (!res.ok) return console.log('Erro ao atualizar status do usuário');
        } catch (error) {
          console.error('Erro ao conectar com servidor:', error);
        }
      };
      ws.onmessage = processMessage;

      console.log('Login automático:', user);
      await carregarMensagens();
    } catch (error) {
      console.error('Erro ao validar token:', error);
    }
  }
}

btn_login.addEventListener('click', async function () {
  Login()
})

input_box.addEventListener('submit', sendMessage)

window.addEventListener("beforeunload", async () => {
  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`${API_URL}/status/status-offline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return console.log('Erro ao atualizar status do usuário');
    }
  } catch (error) {
    console.error(error)
  }
});

setInterval(() => {
  getOtherStatus()
}, 2000)

setInterval(() => {
  setStatus()
}, 1000);

window.addEventListener('load', async () => {
  await autoLogin()
  await getOtherStatus
  setStatus
}) 
