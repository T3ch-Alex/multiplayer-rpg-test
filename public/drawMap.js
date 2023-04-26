var ctx = null;
var tileH = 40;
var tileW = 40;
var mapH = 16;
var mapW = 16;

var currSec = 0, frameCount = 0, frameLastSec = 0;

var map = [
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,0,
    0,1,1,1,0,0,1,0,0,0,1,1,1,1,1,0,
    0,1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,
    0,0,0,1,0,0,1,0,0,0,1,1,1,1,0,0,
    0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,
    0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,
    0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,
    0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,
];

function drawMap() {
    if(ctx==null) {
        console.log("Error: couldn't get 2D context!");
        return;
    }

    var sec = Math.floor(Date.now()/1000);
    if(sec!=currSec) {
        currSec = sec;
        frameLastSec = frameCount;
        frameCount = 1;
    } else { frameCount++; }

    for(var y = 0; y < mapH; y++) {
        for(var x = 0; x < mapW; x++) {
            switch(map[((y*mapH) + x)]) {
                case 0:
                    ctx.fillStyle = '#000';
                    break;
                default:
                    ctx.fillStyle = '#fff';
            }
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH);
        }
    }

    ctx.fillStyle = '#f00';
    ctx.fillText("FPS: " + frameLastSec, 10, 20);

    requestAnimationFrame(drawMap);
}

window.onload = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    requestAnimationFrame(drawMap);
    ctx.font = 'bold 1.2em sans-serif';
}