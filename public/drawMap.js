var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var fps = 60;

var tilesheet = new Image();
tilesheet.src = '/public/assets/world/tiles-overworld.png';

document.body.style.zoom = "250%";

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

function draw() {
    setTimeout(() => {
        requestAnimationFrame(draw);
        ctx.FillStyle = "rgb(20,20,20)";
        ctx.FillRect(0,0,256,240);
    }, 1000/fps);
}
draw();