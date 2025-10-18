const inputUpdateNome = document.getElementById('inputUpdateNome')
const inputUpdateEmail = document.getElementById('inputUpdateEmail')

async function verificarPalavra() {
    const usernameVerify = inputUpdateNome.value
    const token = localStorage.getItem('token')

    const res = await fetch('https://backend-syncnote.onrender.com/check-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({username: usernameVerify })
    });

    const data = await res.json()

    if (data.permitido) {
    console.log('nome validado')
    return true;
    } else {
        console.log('nome nao passo na funcao de verificacao!')
        return false;
    }
}

inputUpdateNome.addEventListener('keydown', async function(e){
   if (e.key === 'Enter') {
    const newUsername = inputUpdateNome.value;
    const token = localStorage.getItem('token')

    if (!newUsername) {
        alert('Campo vazio')
        return;
    }

    try {
        const permitido = await verificarPalavra(newUsername)

        if (!permitido) {
            console.log('nome nao permitido')
            return;
        }

        const res = await fetch('https://backend-syncnote.onrender.com/updateUsername', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({username : newUsername})
        });

        if (res.ok) {
            console.log('Nome Atualizado com sucesso')
            alert('Nome atualizado com sucesso')
        } else {
            alert('erro a atualizar nome de usuario')
        }
    } catch (error) {
        console.error(error)
        alert('erro na autenticação com o servidor')
    }
}})

inputUpdateEmail.addEventListener('keydown', async function(e){
   if (e.key === 'Enter') {
    const token = localStorage.getItem('token')
    const newEmail = inputUpdateEmail.value

    const res = await fetch('https://backend-syncnote.onrender.com/updateEmail', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({email: newEmail})
    })

    if (res.ok) {
        alert('Email atualizado com sucesso!')
    }
}
})
