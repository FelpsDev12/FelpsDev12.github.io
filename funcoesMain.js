function logout() {
    const getToken = localStorage.getItem('token')
    if (getToken) {
        localStorage.removeItem('token')
        window.location.href = '/'
    }
}