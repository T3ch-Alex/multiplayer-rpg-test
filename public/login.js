var socket = io();

var email = document.getElementById('email');
var password = document.getElementById('password');
var loginButton = document.getElementById('loginButton');
var createAccButton = document.getElementById('createAccButton');
document.body.style.zoom = "340%";


loginButton.onclick = () => {
    console.log('clicking login')
    socket.emit('logIn', { emailVal: email.value, passVal: password.value });
}

socket.on('loginIn', (data) => {console.log(data)});