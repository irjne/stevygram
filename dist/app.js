"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users = require('./routes/users');
const chats = require('./routes/chats');
const app = express_1.default();
app.use('/users', users);
app.use('/chats', chats);
app.listen(3001, () => console.log('Server running!'));
//# sourceMappingURL=app.js.map