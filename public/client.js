var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('chatForm');
var input = document.getElementById('chatInput');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var fps = 0;
var lastTime = performance.now();

//Tiles dimensions
const tileSize = 16;

//var tilesheet = new Image();
//tilesheet.src = '/public/assets/world/tilesheet.png';

var batata = new Image();
batata.src = '/public/assets/player/batatinha2.png';

document.body.style.zoom = "340%";

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

socket.on('updateGame', (data) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < data.length; i++) {
        //ctx.fillStyle = '#fff'
        //ctx.font = 'Times New Roman';
        if(batata) {
            let batataFrameX = getPlayerTile(data[i].frame).tileX;
            let batataFrameY = getPlayerTile(data[i].frame).tileY;
            ctx.drawImage(batata, batataFrameX, batataFrameY, tileSize, tileSize, data[i].x, data[i].y, tileSize, tileSize);
        } else { console.log("fuck"); }
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


//FUNCTIONS ------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------


function getPlayerTile(tileIndex) {
    let tileSheetArray = new Array();
    let sheetRows = 4;
    let sheetCols = 4;
    for(var y = 0; y < sheetRows; y++) {
        for (var x = 0; x < sheetCols; x++) {
            let tileCoords = new Array(2);
            tileCoords[0] = x * tileSize;
            tileCoords[1] = y * tileSize;
            tileSheetArray.push(tileCoords);
        }
    }
    var index = tileSheetArray[tileIndex];
    var tileX = tileSheetArray[tileIndex][0];
    var tileY = tileSheetArray[tileIndex][1];

    return { index, tileX, tileY };
}