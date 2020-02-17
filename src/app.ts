import express from 'express';
import users from './routes/users'
import chats from './routes/chats'
import main from './routes/main'
import bodyParser from 'body-parser';
import cors from 'cors';
import socketio from 'socket.io';
import { Message } from './lib/chats'
import http from "http";
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let server = http.createServer(express());
export let io = socketio(server);

app.use('/', main);
app.use('/users', users);
app.use('/chats', chats);

// io.on('connection', (socket: any) => {
//     console.log("socket connected!");
//     socket.on('disconnect', function () {
//         io.emit('users-changed', { user: socket.username, event: 'left' });
//         console.log(io.emit('users-changed', { user: socket.username, event: 'left' }));
//     });

//     socket.on('set-name', (name: string) => {
//         socket.username = name;
//         io.emit('users-changed', { user: name, event: 'joined' });
//         console.log(io.emit('users-changed', { user: name, event: 'joined' }));
//     });

//     socket.on('send-message', (message: Message) => {
//         io.emit('message', { body: message.body, sender: message.sender, date: message.date });
//         console.log(io.emit('message', { body: message.body, sender: message.sender, date: message.date }));
//     });
// });
io.on("connection", (socket: socketio.Socket & { message: Message }) => {
    socket.send('hi');
    socket.on("disconnect", () => { console.log("connection closed") });
    console.log("socket.on(disconnect)");

    socket.on("add-message", (message: Message) => {
        socket.message = message;
        console.log("socket.on(add-message)");
        console.log(socket.message);
    });
});

app.listen(process.env.PORT || 3005, () => console.log('🙌 Server is running!'));
server.listen(4000, () => { });
module.exports = app;

//tsc -p prima di pushare