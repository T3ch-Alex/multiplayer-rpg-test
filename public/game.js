//import tilesheetJS from '/public/assets/world/tilesheet.js';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var fps = 0;
var lastTime = performance.now();

//Tiles dimensions
var tileSize = 32;
//Map dimensions
var mapWidth = 16;
var mapHeight = 15;
//Tilesheet dimensions
var sheetWidth = 14;
var sheetHeight = 12;

var tilesheet = new Image();
tilesheet.src = '/public/assets/world/tilesheet.png';

//document.body.style.zoom = "150%";

var map = [
    [14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14],
    [14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,14],
    [14, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1, 2, 2, 2, 1,14],
    [14, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,14],
    [14, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1,14],
    [14, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,14],
    [14, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1,14],
    [14, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1,14],
    [14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14],
];

function update() {
    var currentTime = performance.now();
    var delta = currentTime - lastTime;
    fps = Math.round(1000/delta);
    lastTime = currentTime;
}

function drawMap() {
    for(let row = 0; row < map.length; row++) {
        for(let col = 0; col < map[row].length; col++) {
            var tileIndex = map[row][col];

            var rowSheet = Math.floor(tileIndex / sheetWidth);
            var colSheet = tileIndex % sheetHeight;
            var tileX = colSheet * tileSize;
            var tileY = rowSheet * tileSize;

            ctx.drawImage(tilesheet, tileX, tileY, tileSize, tileSize, col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();

    ctx.fillStyle = '#f00';
    ctx.font = "24px Arial";
    ctx.fillText("FPS: " + fps, 10, 20); 
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

//Start everything
loop();