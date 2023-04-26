var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var fps = 0;
var lastTime = performance.now();

var tilesheet = new Image();
tilesheet.src = '/public/assets/world/tiles-overworld.png';

function update() {
    var currentTime = performance.now();
    var delta = currentTime - lastTime;
    fps = Math.round(1000/delta);
    lastTime = currentTime;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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