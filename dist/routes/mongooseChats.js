"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const mongooseUsers_1 = require("./mongooseUsers");
// this statement prints plain mongoDB queries on terminal
mongoose_1.default.set('debug', true);
// defining schema and model of users collection
const Schema = mongoose_1.default.Schema;
const messagesSchema = new Schema({
    sender: String,
    body: String,
    date: Date
});
let messagesModel = mongoose_1.default.model("message", messagesSchema);
const chatsSchema = new Schema({
    id: Number,
    name: String,
    description: String,
    admin: [String],
    users: [String],
    messages: [Object],
    lastMessage: Object
});
let chatsModel = mongoose_1.default.model("chat", chatsSchema);
const router = express_1.default.Router();
// returns either user's chats or whole chats collection 
router.get('/', mongooseUsers_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongooseUsers_1.mongoDBConnection();
        let chats;
        if (res.locals.userOnSession) {
            // sends user's chats
            chats = yield chatsModel.find({ users: { "$in": [res.locals.userOnSession] } }, (err, chats) => {
                if (err)
                    res.send("Error!");
                else
                    res.send(chats);
            });
        }
        // sends all chats collection
        else
            chats = yield chatsModel.find((err, chats) => {
                if (err) {
                    res.send("Error!");
                }
                else {
                    res.send(chats);
                }
            });
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], mongooseUsers_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongooseUsers_1.mongoDBConnection();
    const id = req.params.id;
    try {
        if (res.locals.userOnSession) {
            // sends user's chats
            let users = yield chatsModel.findOne({ id: id }, 'users', (err, chats) => {
                if (err)
                    res.send("Error!");
                else
                    res.send(users);
            });
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
/*const generateHashedPassword = async (password: String): Promise<any> => {
    try {
        const salt = await bcrypt.genSalt(5);
        let hashedPassword = await bcrypt.hash(password, salt);

        console.log(hashedPassword);
    }
    catch (err) {
        return err;
    }
}

generateHashedPassword("Daria");*/
exports.default = router;
//# sourceMappingURL=mongooseChats.js.map