"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//Cannot find name 'require'. 
//Do you need to install type definitions for node? Try `npm i @types/node`.
const users = require('./routes/users');
const chats = require('./routes/chats');
//installare npm i @types/node per togliere questo errore
const app = express_1.default();
app.use('/users', users);
app.use('/chats', chats);
app.listen(3001, () => console.log('Server running!'));
//# sourceMappingURL=app.js.map