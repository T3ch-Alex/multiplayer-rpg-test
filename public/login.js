var socket = io();

var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var loginButton = document.getElementById('loginButton');
var createAccButton = document.getElementById('createAccButton');
document.body.style.zoom = "340%";


loginButton.onclick = () => {
    console.log('clicking login')
    socket.emit('logIn', { email: emailInput.value, password: passwordInput.value });
}

createAccButton.onclick = () => {
    console.log('clicking createAcc');
    socket.emit('createAcc', { email: emailInput.value, password: passwordInput.value })
}

socket.on('loginIn', (data) => {
    console.log(data);
    //dando b.o na hora de mudar de pagina aqui, tem q fazer no servidor
});

socket.on('errMsg', (msg) => {
    console.log(msg);
}); 