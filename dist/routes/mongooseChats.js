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
// const messagesSchema = new Schema({
//     sender: String,
//     body: String,
//     date: Date
// });
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
        // sends whole chats collection
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
// returns all user phones of a chat by its id
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
    console.log("chat id: " + id);
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
], mongooseUsers_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongooseUsers_1.mongoDBConnection();
    const id = req.params.id;
    console.log("chat id: " + id);
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let messages;
            messages = yield chatsModel.findOne({ id: id }, 'messages').exec();
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
], mongooseUsers_1.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongooseUsers_1.mongoDBConnection();
    const id = req.params.id;
    console.log("chat id: " + id);
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
router.put('/:id', mongooseUsers_1.authorization, [
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
        mongooseUsers_1.mongoDBConnection();
        const id = req.params.id;
        console.log("chat id: " + id);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values next to a <<then>> method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let chat;
            chat = yield chatsModel.findOne({ id: id }).exec();
            if (description !== "") {
                const modifyingChat = yield chatsModel.findOneAndUpdate({ id: id }, { description: description }, {
                    new: true
                });
            }
            if (name !== "") {
                const modifyingChat = yield chatsModel.findOneAndUpdate({ id: id }, { name: name }, {
                    new: true
                });
            }
            let modifiedChat;
            modifiedChat = yield chatsModel.findOne({ id: id }).exec();
            res.status(200).json({ "chat": chat, "modifiedChat": modifiedChat });
        }
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// it adds a message, by body, to a chat by id. 
// It returns this chat after this operation.
// IT STILL DOESN'T WORK
router.put('/:id/add-message', mongooseUsers_1.authorization, [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.body('sender')
        .trim()
        .isString(),
    express_validator_1.body('body')
        .isString(),
    express_validator_1.body('date')
        .isString(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!req.body.sender && !req.body.body && !req.body.date) {
        return res.status(400).json({ Error: "Sender, body and date are required" });
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { sender, body, date } = req.body;
    const addingMessage = {
        sender: sender,
        body: body,
        date: date
    };
    try {
        mongooseUsers_1.mongoDBConnection();
        const filter = { id: id };
        console.log(req.body);
        console.log(addingMessage);
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new message will be added to chat messages array just once. Without 
        // them, it will happen twice and the whole messages array could be overwritten.
        let chat = yield chatsModel.findOneAndUpdate(filter, {
            $push: {
                message: { sender: sender, body: body, date: date },
            }
        }, { upsert: true, new: true }, (err, chat) => {
            if (err) {
                res.status(500).json({ "error": err });
            }
            else {
                res.status(200).json({ "addingMessageLog": chat });
            }
        });
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// //DELETE - url: /:id, cancella la chat avendo l'id.
router.delete('/:id', mongooseUsers_1.authorization, [
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
            mongooseUsers_1.mongoDBConnection();
            let deletingChat = yield chatsModel.findOneAndRemove({ id: id }).exec();
            res.status(200).json({
                message: "chat deleted successfully",
                deletingChat: deletingChat
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
exports.default = router;
//# sourceMappingURL=mongooseChats.js.map