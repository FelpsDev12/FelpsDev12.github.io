const btnRegister = document.getElementById('btnConfirm');

async function cadastro() {

  const username = document.getElementById('inputNome').value;
  const email = document.getElementById('inputEmail').value;
  const password = document.getElementById('inputSenha').value;


  if (!username || !email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  try {

    const res = await fetch('https://backend-syncnote.onrender.com/users', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      console.log('Registrado');

      try {
        const email = document.getElementById('inputEmail').value;
        const password = document.getElementById('inputSenha').value;

        const res = await fetch('https://backend-syncnote.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json()

        if (res.ok) {
          localStorage.setItem('token', data.token)
          window.location.href = 'main.html'
        } else {
          alert(data.error || 'erro no login')
        }
      } catch (error) {
       console.error(error)
       alert('erro de conexao com o servidor')
      }
    }

    const data = await res.json();
    alert(data.message || "Erro ao registrar usuário");
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor");
  }
}

async function login() {
  const username = document.getElementById('inputNomeL').value;
  const email = document.getElementById('inputEmailL').value;
  const password = document.getElementById('inputSenhaL').value;

  if (!username || !email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const res = await fetch('https://backend-syncnote.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert(data.message);

      alert(`email: ${email} \n senha: ${password}`)

      localStorage.setItem('userEmail', email)

      window.location.href = 'main.html'
    } else {
      alert(data.error || 'erro no login')
    }
  } catch (error) {
    console.error(error);
    alert('erro de conexao com servidor')
  }
};

