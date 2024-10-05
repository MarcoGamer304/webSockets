import express from 'express';
import http from 'http';
import { Server } from "socket.io";

const menssagesList = [];
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
     res.send('<h2>¡Este es un mensaje desde el servidor Express!</h2>');
});


io.on('connection', function (socket) {
    let username = 'incognito';
    //Logger Servidor
    console.log('user Connnect ' + socket.id)

    socket.on('userRegister', (nerUsername) => {
        username = nerUsername;
    })

    socket.on('newMessage', (msg) => {
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        console.log('Mensaje recibido del cliente:', msg);
        socket.emit('respuestaServidor', { user: username, message: msg });
        socket.broadcast.emit('respuestaServidor', { user: username, message: msg });
        menssagesList.push(['User: ' + username + ' Message: ' + msg + ' Date: ' + date + ' Time: '+ time])
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        menssagesList.forEach(element => {
            console.log(element)
        });

    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});