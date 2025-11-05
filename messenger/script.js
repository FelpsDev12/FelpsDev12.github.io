const auth_container = document.querySelector('.auth_container')
const username_input = document.getElementById('username_input')
const main = document.querySelector('main')
const input_message = document.getElementById('input_message')
const input_box= document.querySelector('.input_box')
const message_self = document.querySelector('.message_self')
const message_self_content = document.querySelector('.message_self')
const messages_box = document.querySelector('.messages_box')
const btn_login = document.getElementById('btn_login')
const getUserId = localStorage.getItem('userId')

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

  ws = new WebSocket('ws://backend-loveable.onrender.com')
  ws.onmessage = processMessage
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
    ws = new WebSocket("ws://ws://backend-loveable.onrender.com");
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

      ws = new WebSocket(API_URL.replace('https', 'wss'))
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

window.onload = autoLogin
