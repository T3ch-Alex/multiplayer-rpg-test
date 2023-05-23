var socket = io();
var game = document.getElementById('gameWindow');
game.style.display = 'none';
var login = document.getElementById('loginContainer');

//LOGIN
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
    console.log('Now make enter the game');
    login.style.display = 'none';
    game.style.display = 'flex';
    document.body.style.zoom = '0%';
});

socket.on('errMsg', (msg) => {
    console.log(msg);
}); 

