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
var PLAYER_LIST = {};

var newPlayer = (playerID) => {
    var self = {
        x: 120,
        y: 88,
        id: playerID,
        number: "" + Math.floor(10 * Math.random()),
        pressingUp: false,
        pressingDown: false,
        pressingLeft: false,
        pressingRight: false,
        maxSpeed: 1,
    };

    self.updatePosition = () => {
        if(self.pressingUp) { self.y -= self.maxSpeed; }
        if(self.pressingDown) { self.y += self.maxSpeed; }
        if(self.pressingLeft) { self.x -= self.maxSpeed; }
        if(self.pressingRight) { self.x += self.maxSpeed; }
    }

    return self;
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html')); //FIRST WE SERVE ONLY THE HTML!!!
});

app.use('/', express.static(path.join(__dirname + '/../'))); //THEN WE SERVE THE ENTIRE PUBLIC FOLDER OTHERWISE IT WILL NOT LOAD SOCKET.IO LIBRARY ON THE CLIENT!!!!

io.on('connection', (socket) => {
    socket.id = Math.floor(Math.random() * 90000) + 10000;
    SOCKET_LIST[socket.id] = socket;

    var player = newPlayer(socket.id);
    PLAYER_LIST[socket.id] = player;
    
    console.log('user with id: ' + `${socket.id}` + ' connected!');

    socket.on('disconnect', () => {
        console.log('user with id: ' + `${socket.id}` + ' disconnected');
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

    socket.on('clientMessage', (msg) => {
        var clientMsg = socket.id + ': ' + msg;
        io.emit('clientMessage', clientMsg);
    });

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
});

function update() {
    setInterval(()=>{
        var pack = [];
        //get every player state and push to datapack
        for(var i in PLAYER_LIST) {
            var player = PLAYER_LIST[i];
            player.updatePosition();
            pack.push({
                x: player.x,
                y: player.y,
                id: player.id,
                number: player.number,
            });
        }
        //emit the datapack for every socket
        for(var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i]
            socket.emit('newPositions', pack);
        }
    },1000/60);
}

server.listen(port, host, () => {
    console.log("Server hosting at " + `${host}` + ":" + `${port}`);
}); 

update();