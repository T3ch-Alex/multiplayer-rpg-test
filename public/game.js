var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var fps = 0;
var lastTime = performance.now();

//Tiles dimensions
const tileSize = 16;
var tilesheet = new Image();
tilesheet.src = '/public/assets/world/tilesheet.png';

document.body.style.zoom = "250%";

var map = [
    [ 30, 30, 30, 30, 75, 19,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 30, 75, 19,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 30, 93,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 75, 19,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 93,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 93,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 93,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 93,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30,111, 37,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 30,111, 37,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3],
    [ 30, 30, 30, 30,111, 37,  3,  3,  3,  3,  3,  3,  3,  3,  3]
];

var mapObjects = [
    [  0,  0,  0,  0,  0,  0,  0,  0,369,370,371,372,373,369,370],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,460,461,462,333,334],
    [  0,  0,324,325,  0,  0,537,538,  0,  0,478,479,480,351,352],
    [  0,  0,342,343,  0,  0,  0,  0,  0,328,496,497,498,369,370],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,329,514,515,516,329,  0],
    [  0,  0,  0,  0,555,556,  0,  0,  0,  0, 64, 65,  0,  0,  0],
    [288,289,  0,  0,  0,  0,  0,  0,  0, 11, 82, 83, 12, 12, 12],
    [306,307,  0,  0,  0,  0,  0,  0,  0, 29, 30, 30, 75, 76, 76],
    [  0,  0,  0,  0,  0,  0,  0,537,538, 47, 48, 48, 49,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
];

function update() {
    var currentTime = performance.now();
    var delta = currentTime - lastTime;
    fps = Math.round(1000/delta);
    lastTime = currentTime;
}

function drawMap() {
    for(var row = 0; row < map.length; row++) {
        for(var col = 0; col < map[row].length; col++) {
            var tileMapIndex = map[row][col];
            var tileSheetX = getTile(tileMapIndex).tileX;
            var tileSheetY = getTile(tileMapIndex).tileY;
            ctx.drawImage(tilesheet, tileSheetX, tileSheetY, tileSize, tileSize, col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

function drawObjects() {
    for(var row = 0; row < mapObjects.length; row++) {
        for(var col = 0; col < mapObjects[row].length; col++) {
            var tileMapIndex = mapObjects[row][col];
            var tileSheetX = getTile(tileMapIndex).tileX;
            var tileSheetY = getTile(tileMapIndex).tileY;
            ctx.drawImage(tilesheet, tileSheetX, tileSheetY, tileSize, tileSize, col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

function getTile(tileIndex) {
    var tileSheetArray = new Array();
    const sheetRows = 44;
    const sheetCols = 18;
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawObjects();

    ctx.fillStyle = '#f00';
    ctx.font = "8px Arial";
    ctx.fillText("FPS: " + fps, 10, 20); 
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

//Start everything
loop();