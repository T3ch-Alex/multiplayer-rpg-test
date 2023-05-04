var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('chatForm');
var input = document.getElementById('chatInput');

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

document.onkeydown = (event) => {
    if(event.keyCode == 87) {
    socket.emit('keyPressed', {input: 'up', state:true});
    } else if(event.keyCode == 83) {
    socket.emit('keyPressed', {input: 'down', state:true});
    } else if(event.keyCode == 68) {
    socket.emit('keyPressed', {input: 'right', state:true});
    } else if(event.keyCode == 65) {
    socket.emit('keyPressed', {input: 'left', state:true});
    }
}

document.onkeyup = (event) => {
    if(event.keyCode == 87) {
    socket.emit('keyPressed', {input: 'up', state:false});
    } else if(event.keyCode == 83) {
    socket.emit('keyPressed', {input: 'down', state:false});
    } else if(event.keyCode == 68) {
    socket.emit('keyPressed', {input: 'right', state:false});
    } else if(event.keyCode == 65) {
    socket.emit('keyPressed', {input: 'left', state:false});
    }
}