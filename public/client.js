var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('chatForm');
var input = document.getElementById('chatInput');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var fps = 0;
var lastTime = performance.now();

document.body.style.zoom = "200%";

form.addEventListener('submit', (e) => {
    e.preventDefault();
    var msg = input.value;
    if(msg) {
        socket.emit('clientMessage', msg);
        msg = '';
        input.value = '';
    } else { console.log("no message found!");}
});

socket.on('clientMessage', (msg) => {
    var msgElement = document.createElement('li');
    msgElement.id = 'chatMessage';
    msgElement.textContent = msg;
    messages.appendChild(msgElement);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('newPositions', (data) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < data.length; i++) {
        ctx.fillText(data[i].number, data[i].x, data[i].y);
    }
});

document.addEventListener('keydown', (event) => {
    if(event.code == 'KeyW') {
        socket.emit('keyPressed', {input: 'up', state:true});
    } else if(event.code == 'KeyS') {
        socket.emit('keyPressed', {input: 'down', state:true});
    } else if(event.code == 'KeyD') {
        socket.emit('keyPressed', {input: 'right', state:true});
    } else if(event.code == 'KeyA') {
        socket.emit('keyPressed', {input: 'left', state:true});
    }
});

document.addEventListener('keyup', (event) => {
    if(event.code == 'KeyW') {
        socket.emit('keyPressed', {input: 'up', state:false});
    } else if(event.code == 'KeyS') {
        socket.emit('keyPressed', {input: 'down', state:false});
    } else if(event.code == 'KeyD') {
        socket.emit('keyPressed', {input: 'right', state:false});
    } else if(event.code == 'KeyA') {
        socket.emit('keyPressed', {input: 'left', state:false});
    }
});