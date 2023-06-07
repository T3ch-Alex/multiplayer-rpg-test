//Libraries
const express = require('express'); 
const http = require('http');
const { Server } = require('socket.io'); //Get a Server object inside the socket library
const path = require('path'); //Used for finding complex folders paths
const bcrypt = require('bcrypt');

const app = express(); //Init express
const server = http.createServer(app); //Init a http server with the express app
const io = new Server(server); //Init new Server object called io with the http server

const mongojs = require('mongojs');
const connectionString = 'mongodb://localhost:27017/multiplayer-game';
const db = mongojs(connectionString);
const accounts = db.collection('accounts');
const characters = db.collection('characters');

const host = 'localhost';
const port = 3000;
const FPS = 60;

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
    self.animCounter = 0;
    self.animFrame = 0;

    var updatePlayer = self.update;
    self.update = () => {
        self.updateSpd();
        updatePlayer();
    }

    self.updateSpd = () => {
        //UP
        if(self.pressingUp) { 
            if(self.animFrame < 4 || self.animFrame > 8) {
                self.animFrame = 4;
            }
            self.spdY = -self.maxSpd; 
            self.animCounter++;
            if(self.animCounter >= 10) {
                self.animFrame++;
                self.animCounter = 0;
                if(self.animFrame >= 8) {
                    self.animFrame = 4;
                }
            }
        //DOWN
        } else if(self.pressingDown) { 
            if(self.animFrame > 4) {
                self.animFrame = 0;
            }
            self.spdY = +self.maxSpd; 
            self.animCounter++;
            if(self.animCounter >= 10) {
                self.animFrame++;
                self.animCounter = 0;
                if(self.animFrame >= 4) {
                    self.animFrame = 0;
                }
            }
        } else { 
            self.spdY = 0; 
        }

        //LEFT
        if(self.pressingLeft) { 
            if(self.animFrame < 8 || self.animFrame > 12) {
                self.animFrame = 8;
            }
            self.spdX = -self.maxSpd; 
            self.animCounter++
            if(self.animCounter >= 10) {
                self.animFrame++;
                self.animCounter = 0;
                if(self.animFrame >= 12) {
                    self.animFrame = 8;
                }
            }
        //RIGHT
        } else if(self.pressingRight) { 
            if(self.animFrame < 12) {
                self.animFrame = 12;
            }
            self.spdX = +self.maxSpd; 
            self.animCounter++
            if(self.animCounter >= 10) {
                self.animFrame++;
                self.animCounter = 0;
                if(self.animFrame >= 16) {
                    self.animFrame = 12;
                }
            }
        } else { 
            self.spdX = 0; 
        }
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
            counter: player.animCounter,
            frame: player.animFrame,
        });
    }
    return pack;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/login.html')); //FIRST WE SERVE ONLY THE HTML!!!
});

app.use('/', express.static(path.join(__dirname + '/../'))); //THEN WE SERVE THE ENTIRE PUBLIC FOLDER OTHERWISE IT WILL NOT LOAD SOCKET.IO LIBRARY ON THE CLIENT!!!!




io.on('connection', (socket) => {
    socket.id = Math.floor(Math.random() * 90000) + 10000;
    SOCKET_LIST[socket.id] = socket;

    socket.on('createAcc', (data) => {
        const existingUser = accounts.find( { email: 'user1' }, (err, result) => {
            if(err || !result) {
                console.log('Internal server Error, user not found. Error: ', err);
                let msg = "Internal server Error, user not found. Error: " + err;
                io.emit('errMsg', msg);
                return
            }
        });
        const saltRounds = 10;

        if(existingUser) {
            let msg = "Account already exists with this email";
            io.emit('errMsg', msg);
            return
        }

        //Gerar o salt, depois gerar o hash com o salt
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) {
                let msg = "Internal server error";
                io.emit('errMsg', msg);
                return
            }
            bcrypt.hash(data.password, salt, (err, hashedPassword) => {
                if(err) {
                    let msg = "Internal server error";
                    io.emit('errMsg', msg);
                    return
                }

                //Se gerado, criar novo usuario
                const newAccount = { 
                    id: accounts.length + 1, 
                    email: data.email, 
                    password: hashedPassword,
                    role: 1
                };

                accounts.insertOne(newAccount);

                let msg = "User registered succesfully!";
                io.emit('errMsg', msg);
                return
            });
        });
    });

    socket.on('logIn', (data) => {
        console.log(data);
        const userFound = accounts.find( { email: data.email }, (err, result) => {
            if(err || !result) {
                console.log('Internal server Error, user not found. Error: ', err);
                let msg = "Internal server Error, user not found. Error: " + err;
                io.emit('errMsg', msg);
                return
            }
        });

        if(!userFound) {
            console.log('User not found.');
            let msg = "User with this email not found.";
            io.emit('errMsg', msg);
            return
        }

        //Comparar password com o hash na database
        bcrypt.compare(data.password, userFound.password, (err, result) => {
            if(err || !result) {
                let msg = "Authentication failed! at password";
                io.emit('errMsg', msg);
                return
            }
            Player.onConnect(socket);
            let msg = "Congrats, youve logged in " + userFound.email + "!!";
            io.emit('loginIn', msg);
        });
    });
    
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
            socket.emit('updateGame', pack);
        }
    },1000/FPS);
}

server.listen(port, host, () => {
    console.log("Server hosting at " + `${host}` + ":" + `${port}`);
}); 

gameLoop();