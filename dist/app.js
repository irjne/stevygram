"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const chats_1 = __importDefault(require("./routes/chats"));
const app = express_1.default();
app.use('/users', users_1.default);
app.use('/chats', chats_1.default);
app.listen(3001, () => console.log('🙌 Server is running!'));
//# sourceMappingURL=app.js.map