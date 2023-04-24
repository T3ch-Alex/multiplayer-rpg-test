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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html')); //FIRST WE SERVE ONLY THE HTML!!!
});

app.use('/', express.static(path.join(__dirname + '/../'))); //THEN WE SERVE THE ENTIRE CLIENT FOLDER OTHERWISE IT WILL NOT LOAD SOCKET.IO LIBRARY ON THE CLIENT!!!!

io.on('connection', (socket) => {
    const socketID = Math.floor(Math.random() * 90000) + 10000;
    console.log('user with id: ' + `${socketID}` + ' connected!');
    socket.on('disconnect', () => {
        console.log('user with id: ' + `${socketID}` + ' disconnected');
    });

    socket.on('clientMessage', (msg) => {
        var clientMsg = socketID + ': ' + msg;
        io.emit('clientMessage', clientMsg);
    });
});

server.listen(port, host, () => {
    console.log("Server hosting at " + `${host}` + ":" + `${port}`);
}); 