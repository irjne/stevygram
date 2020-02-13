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
//import { }, userOnSession } from './users';
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./users");
// this statement prints plain mongoDB queries on terminal
mongoose_1.default.set('debug', true);
// defining schema and model of users collection
const Schema = mongoose_1.default.Schema;
//let messagesModel = mongoose.model<Message>("message", messagesSchema);
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
router.get('/', users_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        users_1.mongoDBConnection();
        let chats;
        if (res.locals.userOnSession) {
            // sends user's chats
            chats = yield chatsModel.find({ users: { "$in": [res.locals.userOnSession] } }).exec();
            if (chats) {
                chats = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("I'm inside promise.all");
                    if (chat.users.length === 2) {
                        const otherUserPhone = res.locals.userOnSession === chat.users[0] ? chat.users[1] : chat.users[0];
                        const otherUser = yield users_1.usersModel.find({ phone: otherUserPhone }).exec();
                        chat.name = `${otherUser[0].name} ${otherUser[0].surname}`;
                    }
                    return chat;
                })));
                res.status(200).send(chats);
            }
            else {
                res.status(500).send("Error: chats not found.");
            }
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// returns all user phones of a chat by its id
router.get('/:id/users', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], users_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    users_1.mongoDBConnection();
    const id = req.params.id;
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let users;
            users = yield chatsModel.findOne({ id: id }, 'users').exec();
            if (users) {
                res.status(200).send(users);
            }
            else {
                res.status(500).send("Error: id invalid.");
            }
        }
        else {
            return res.status(500).send("Error: there's a problem about res.locals.userOnSession");
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// returns all messages of a chat by its id
router.get('/:id/messages', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], users_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    users_1.mongoDBConnection();
    const id = req.params.id;
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let messages = yield chatsModel.findOne({ id: id }, 'messages').exec();
            if (messages) {
                res.status(200).send(messages);
            }
            else {
                res.status(500).send("Error: id invalid.");
            }
        }
        else {
            return res.status(500).send("Error: there's a problem about res.locals.userOnSession");
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// returns a chat document by its id
router.get('/:id', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], users_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    users_1.mongoDBConnection();
    const id = req.params.id;
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let chat;
            chat = yield chatsModel.findOne({ id: id }).exec();
            if (chat) {
                res.status(200).send(chat);
            }
            else {
                res.status(500).send("Error: id invalid.");
            }
        }
        else {
            return res.status(500).send("Error: there's a problem about res.locals.userOnSession");
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// it modifies the chat with this id. New data are passed by body.
// Body must have at lest a not empty field, otherwise it will return an error.
// It returns a chat before and after modifying operation.
// Chat before modifying is useful for client forms.
router.put('/:id', users_1.authorization, [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.body('description')
        .isString(),
    express_validator_1.body('name')
        .isString(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!req.body.description && !req.body.name) {
        return res.status(400).json({
            errors: "Either name or description are required"
        });
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { description, name } = req.body;
    try {
        users_1.mongoDBConnection();
        const id = req.params.id;
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values next to a <<then>> method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            const originalChat = yield chatsModel.findOne({ id: id }).exec();
            if (description !== "") {
                const chat = yield chatsModel.findOneAndUpdate({ id: id }, { description: description }, {
                    new: true
                });
            }
            if (name !== "") {
                const chat = yield chatsModel.findOneAndUpdate({ id: id }, { name: name }, {
                    new: true
                });
            }
            const modifiedChat = yield chatsModel.findOne({ id: id }).exec();
            res.status(200).json({ "chat": originalChat, "modifiedChat": modifiedChat });
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// it adds a message, by body, to a chat by id. 
// It returns this chat document after this operation.
router.put('/:id/add-message', users_1.authorization, [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.body('sender')
        .trim()
        .isString(),
    express_validator_1.body('body')
        .trim()
        .isString(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!req.body.sender && !req.body.body) {
        return res.status(400).json({ Error: "Sender and body are required" });
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { sender, body } = req.body;
    try {
        users_1.mongoDBConnection();
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new message will be added to chat messages array just once. Without 
        // them, it will happen twice and the whole messages array could be overwritten.
        let date = new Date();
        let chat = yield chatsModel.findOneAndUpdate({ id: id }, { $push: { "messages": { sender: sender, body: body, date: date } } }, { upsert: true, new: true }).exec();
        if (chat) {
            return res.status(200).send(chat);
        }
        else {
            return res.status(500).send("error!!!");
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// It removes a chat
router.delete('/:id', users_1.authorization, [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    if (res.locals.userOnSession) {
        try {
            users_1.mongoDBConnection();
            let chat = yield chatsModel.findOneAndRemove({ id: id }).exec();
            res.status(200).json({
                message: "chat deleted successfully",
                chat: chat
            });
        }
        catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }
    else {
        return res.status(500).send("Error: there's a problem about res.locals.userOnSession");
    }
}));
// it creates a new chat document and returns that
router.post('/', users_1.authorization, [
    express_validator_1.body('description')
        .trim()
        .isString(),
    express_validator_1.body('name')
        .trim()
        .isString()
        .not().isEmpty(),
    express_validator_1.body('users')
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if (res.locals.userOnSession) {
        const { name, description } = req.body;
        let usersBody = req.body.users;
        let users = usersBody.split(',');
        users.push(res.locals.userOnSession);
        let admin = [];
        admin.push(res.locals.userOnSession);
        let messages = [];
        // unique numeric id creation
        let d = new Date();
        let id = d.valueOf();
        try {
            users_1.mongoDBConnection();
            let chat = new chatsModel({ id, description, name, users, admin, messages });
            chat.save(err => {
                if (err)
                    return res.status(500).send(err);
                return res.status(200).send(chat);
            });
        }
        catch (err) {
            return res.status(500).send(`Unexpected error: ${err}`);
        }
    }
    else {
        return res.status(500).send("Error: There's a problem about res.locals.userOnSession");
    }
}));
exports.default = router;
//# sourceMappingURL=chats.js.map