import express from 'express';
import users from './routes/users'
import chats from './routes/chats'
import main from './routes/main'
import bodyParser from 'body-parser';
import cors from 'cors';
import * as socketio from 'socket.io';
import { Message } from './lib/chats'

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.use('/', main);
app.use('/users', users);
app.use('/chats', chats);

io.on('connection', (socket: any) => {
    console.log("socket connected!");
    socket.on('disconnect', function () {
        io.emit('users-changed', { user: socket.username, event: 'left' });
        console.log(io.emit('users-changed', { user: socket.username, event: 'left' }));
    });

    socket.on('set-name', (name: string) => {
        socket.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
        console.log(io.emit('users-changed', { user: name, event: 'joined' }));
    });

    socket.on('send-message', (message: Message) => {
        io.emit('message', { body: message.body, sender: message.sender, date: message.date });
        console.log(io.emit('message', { body: message.body, sender: message.sender, date: message.date }));
    });
});

app.listen(process.env.PORT || 3005, () => console.log('🙌 Server is running!'));
module.exports = app;

//tsc -p prima di pushare