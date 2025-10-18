const titleInstrucoes = document.getElementById('instrucao');
const inputTitle = document.getElementById("inputTitle");
const inputNota = document.getElementById("inputNota");

inputTitle.addEventListener('input', function(){
    titleInstrucoes.textContent = inputTitle.value
})

async function getDados() {   
  const token = localStorage.getItem('token');
const res = await fetch('https://backend-syncnote.onrender.com/user', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (res.status === 401 || res.status === 403) {
  localStorage.removeItem('token')
  window.location.href = '/'
} else {
  const user = await res.json();
  console.log(user);

const divDataUser = document.getElementById('userData');

divDataUser.innerHTML = `
<p id="username">${user.username}</p>
<label id='role'>${user.role}</label>
`
}
}

async function gerarNovoToken() {
  const token = localStorage.getItem('token')
  const getEmail = localStorage.getItem('userEmail')
  const res = await fetch('https://backend-syncnote.onrender.com/newToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({email : getEmail })
  });

  const data = await res.json()

  if (res.ok) {
    alert('Novo token gerado')
    localStorage.setItem('token', data.token)
  } else {
    alert('usuario nao autorizado')
  }
}

async function saveNote() {

    const title = document.getElementById("inputTitle").value;
    const note = document.getElementById("inputNota").value;

    const token = localStorage.getItem('token');

    if (!title || !note) {
        alert('Preencha todos os campos!')
        return;
    }
    
    const res = await fetch('https://backend-syncnote.onrender.com/notes', {
        method: 'POST',
        headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${token}`
    },
        body: JSON.stringify({title, note})
    });

    if (res.ok) {
      alert('nota salva')

      const sidebar = document.querySelector('.sidebar');
    const li = document.createElement('li');
    li.textContent = title;
    sidebar.appendChild(li);

    li.addEventListener('click', function() {
      const showNota = document.querySelector('.showNota');
      const divNota = document.querySelector('.divNota');
      divNota.style.display = 'none';
      showNota.style.display = '';

      showNota.innerHTML = `
        <h2 id="showTitle">${title}</h2>
        <p id="showNoteContent">${note}</p>
      `;
    });
    }
};

async function listarNotas() {

    const token = localStorage.getItem('token')

    const res = await fetch('https://backend-syncnote.onrender.com/notes', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })

    const note = await res.json()

    console.log(note)

    note.forEach(notes => {
        const sidebar = document.querySelector('.sidebar')
        const li = document.createElement('li');
        li.textContent = notes.title

        sidebar.appendChild(li)

        li.addEventListener('click', function(){
        const showNota = document.querySelector('.showNota')
        const divNota = document.querySelector('.divNota')
        divNota.style.display = 'none'
        showNota.style.display = ''

        showNota.innerHTML = `
        <h2 id="showTitle">${notes.title}</h2>

      <p id="showNoteContent">${notes.note}</p>
        `
        })
    });
}

inputNota.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        saveNote()
    }
})

window.addEventListener("visibilitychange", () => {
  if (window.hidden) {
    getDados()
  } else {
    getDados()
  }
});

function verificarTokenExistente () {
  const token = localStorage.getItem('token')

  if (token === null || token === undefined) {
    console.log('sem token')
    window.location.href = '/'
  } else {
    return;
  }
}

window.onload = verificarTokenExistente()
  
window.onload = listarNotas()
window.onload = getDados
