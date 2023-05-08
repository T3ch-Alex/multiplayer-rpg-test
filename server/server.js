//Libraries
const express = require('express'); 
const http = require('http');
const { Server } = require('socket.io'); //Get a Server object inside the socket library
const path = require('path'); //Used for finding complex folders paths

const app = express(); //Init express
const server = http.createServer(app); //Init a http server with the express app
const io = new Server(server); //Init new Server object called io with the http server

const host = 'localhost';
const port = 3000;

var SOCKET_LIST = {};


var Entity = () => {
    var self = {
        x: 120,
        y: 88,
        spdX: 0,
        spdY: 0,
        id: "",
    }
    self.update = () => {
        //This will update more stuff later
        self.updatePosition();
    }
    self.updatePosition = () => {
        self.x += self.spdX;
        self.y += self.spdY;
    }
    return self;
};


var Player = (id) => {
    var self = Entity();
    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingLeft = false;
    self.pressingRight = false;
    self.maxSpd = 1;

    var updatePlayer = self.update;
    self.update = () => {
        self.updateSpd();
        updatePlayer();
    }

    self.updateSpd = () => {
        if(self.pressingUp) { self.spdY = -self.maxSpd; } else if(self.pressingDown) { self.spdY = +self.maxSpd; } else { self.spdY = 0; }
        if(self.pressingLeft) { self.spdX = -self.maxSpd; } else if(self.pressingRight) { self.spdX = +self.maxSpd; } else { self.spdX = 0; }
    }

    Player.list[id] = self;
    return self;
};

Player.list = {};

Player.onConnect = (socket) => {
    var player = Player(socket.id);
    console.log('user with id: ' + `${socket.id}` + ' connected!');
    socket.on('keyPressed', (data) => {
        if(data.input === 'up') {
            player.pressingUp = data.state;
        } else if(data.input === 'down') {
            player.pressingDown = data.state;
        } else if(data.input === 'right') {
            player.pressingRight = data.state;
        } else if(data.input === 'left') {
            player.pressingLeft = data.state;
        }
    });
}

Player.onDisconnect = (socket) => {
    console.log('user with id: ' + `${socket.id}` + ' disconnected');
    delete Player.list[socket.id];
}

Player.update = () => {
    var pack = [];
    for(var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push({
            x: player.x,
            y: player.y,
            id: player.id,
            number: player.number,
        });
    }
    return pack;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html')); //FIRST WE SERVE ONLY THE HTML!!!
});

app.use('/', express.static(path.join(__dirname + '/../'))); //THEN WE SERVE THE ENTIRE PUBLIC FOLDER OTHERWISE IT WILL NOT LOAD SOCKET.IO LIBRARY ON THE CLIENT!!!!

io.on('connection', (socket) => {
    socket.id = Math.floor(Math.random() * 90000) + 10000;
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);

    socket.on('clientMessage', (msg) => {
        var clientMsg = socket.id + ': ' + msg;
        io.emit('clientMessage', clientMsg);
    });

    socket.on('disconnect', () => {
        Player.onDisconnect(socket);
        delete SOCKET_LIST[socket.id];
    });
});

function gameLoop() {
    setInterval(()=>{
        //emit the datapack for every socket
        var pack = Player.update();
        for(var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i]
            socket.emit('newPositions', pack);
        }
    },1000/60);
}

function playerInputListen(socket, player) {
    
}

server.listen(port, host, () => {
    console.log("Server hosting at " + `${host}` + ":" + `${port}`);
}); 

gameLoop();