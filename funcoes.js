const btnConfirm = document.getElementById('btnConfirm');
const btnLogin = document.getElementById('btnLogin');
const btnCadastro = document.getElementById('btnCadastro');

const sectionR = document.querySelector('.register');
const sectionL = document.querySelector('.login');


function loginPage() {
    sectionR.style.display = 'none'
    sectionL.style.display = ''
}

function cadastroPage() {
    sectionL.style.display = 'none'
    sectionR.style.display = ''
}
