const inputUpdateNome = document.getElementById('inputUpdateNome')
const inputUpdateEmail = document.getElementById('inputUpdateEmail')

inputUpdateNome.addEventListener('keydown', async function(e){
   if (e.key === 'Enter') {
    const newUsername = inputUpdateNome.value;

    if (!newUsername) {
        alert('Campo vazio')
        return;
    }

    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:3000/updateUsername', {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({username: newUsername})
    })

    const data = await res.json()

    if (res.ok) {
        alert('Nome de usuario atualizado com sucesso')
    }
}
});

inputUpdateEmail.addEventListener('keydown', async function(e){
   if (e.key === 'Enter') {
    const token = localStorage.getItem('token')
    const newEmail = inputUpdateEmail.value

    const res = await fetch('http://localhost:3000/updateEmail', {
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