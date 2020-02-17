"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const chats_1 = __importDefault(require("./routes/chats"));
const main_1 = __importDefault(require("./routes/main"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
let server = http_1.default.createServer(express_1.default());
exports.io = socket_io_1.default(server);
app.use('/', main_1.default);
app.use('/users', users_1.default);
app.use('/chats', chats_1.default);
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
exports.io.on("connection", (socket) => {
    socket.send('hi');
    socket.on("disconnect", () => { console.log("connection closed"); });
    console.log("socket.on(disconnect)");
    socket.on("add-message", (message) => {
        socket.message = message;
        console.log("socket.on(add-message)");
        console.log(socket.message);
    });
});
app.listen(process.env.PORT || 3005, () => console.log('🙌 Server is running!'));
server.listen(4000, () => { });
module.exports = app;
//tsc -p prima di pushare
//# sourceMappingURL=app.js.map