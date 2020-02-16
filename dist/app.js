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
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);
app.use('/', main_1.default);
app.use('/users', users_1.default);
app.use('/chats', chats_1.default);
io.on('connection', (socket) => {
    console.log("socket connected!");
    socket.on('disconnect', function () {
        io.emit('users-changed', { user: socket.username, event: 'left' });
        console.log(io.emit('users-changed', { user: socket.username, event: 'left' }));
    });
    socket.on('set-name', (name) => {
        socket.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
        console.log(io.emit('users-changed', { user: name, event: 'joined' }));
    });
    socket.on('send-message', (message) => {
        io.emit('message', { body: message.body, sender: message.sender, date: message.date });
        console.log(io.emit('message', { body: message.body, sender: message.sender, date: message.date }));
    });
});
app.listen(process.env.PORT || 3005, () => console.log('🙌 Server is running!'));
module.exports = app;
//tsc -p prima di pushare
//# sourceMappingURL=app.js.map