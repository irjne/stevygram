"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import users from "./routes/users";
//import chats from './routes/chats';
const mongooseUsers_1 = __importDefault(require("./routes/mongooseUsers"));
//import mongooseChats from './routes/mongooseChats'
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
//app.use('/users', users);
//app.use('/chats', chats);
app.use('/mongooseUsers', mongooseUsers_1.default);
//app.use('/mongooseChats', mongooseChats);
app.listen(3003, () => console.log('🙌 Server is running!'));
module.exports = app;
//# sourceMappingURL=app.js.map