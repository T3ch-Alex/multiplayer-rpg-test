var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var fps = 0;
var lastTime = performance.now();

//Tiles dimensions
var tileWidth = 64;
var tileHeight = 64;
var canvasTileWidth = 32;
var canvasTileHeight = 32;
//Map dimensions
var mapWidth = 16;
var mapHeight = 15;
//Tilesheet dimensions
var sheetWidth = 14;
var sheetHeight = 14;

var tilesheet = new Image();
tilesheet.src = '/public/assets/world/tiles-overworld.png';

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
            var sx = ((tileIndex % sheetHeight) * tileWidth);
            var sy = (Math.floor(tileIndex / sheetHeight) * tileHeight);
            ctx.drawImage(tilesheet, sx, sy, tileWidth, tileHeight, col * canvasTileWidth, row * canvasTileHeight, 32, 32);
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