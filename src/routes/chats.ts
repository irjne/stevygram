import { Request, Response } from "express";
import express from 'express';
import { body, param, validationResult, sanitizeParam, query } from 'express-validator';
import mongoose from 'mongoose';
import { Chat } from '../lib/chats';
import { mongoDBConnection, authorization, usersSchema, usersModel } from './users';

// this statement prints plain mongoDB queries on terminal
mongoose.set('debug', true);

// defining schema and model of users collection
const Schema = mongoose.Schema;

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

let chatsModel = mongoose.model<Chat>("chat", chatsSchema);
const router = express.Router();

// returns either user's chats or whole chats collection 
router.get('/', authorization, async (req: Request, res: Response) => {
    try {
        mongoDBConnection();
        let chats: Chat[];
        if (res.locals.userOnSession) {
            // sends user's chats
            chats = await chatsModel.find({ users: { "$in": [res.locals.userOnSession] } }).exec();
            if (chats) {
                chats = await Promise.all(chats.map(async chat => {
                    console.log("I'm inside promise.all");
                    if (chat.users.length === 2) {
                        const otherUserPhone = res.locals.userOnSession === chat.users[0] ? chat.users[1] : chat.users[0];
                        const otherUser = await usersModel.find({ phone: otherUserPhone }).exec();
                        chat.name = `${otherUser[0].name} ${otherUser[0].surname}`;
                    }
                    return chat;
                }));
                res.status(200).json(chats);
            } else {
                res.status(500).send("Error: chats not found.")
            }
        }
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// returns all user phones of a chat by its id
router.get('/:id/users', [
    param('id')
        .isNumeric(),
    sanitizeParam('id').toInt()
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongoDBConnection();
    const id = req.params.id;

    try {
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let users = await chatsModel.find({ id: id }, 'users').exec();
            if (users) {
                res.status(200).json(users);
            } else {
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
});

// returns all messages of a chat by its id
router.get('/:id/messages', [
    param('id')
        .isNumeric(),
    sanitizeParam('id').toInt()
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongoDBConnection();
    const id = req.params.id;
    try {
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let messages = await chatsModel.findOne({ id: id }, 'messages').exec();
            if (messages) {
                res.status(200).json(messages);
            } else {
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
});

// returns a chat document by its id
router.get('/:id', [
    param('id')
        .isNumeric(),
    sanitizeParam('id').toInt()
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongoDBConnection();
    const id = req.params.id;

    try {
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let chat = await chatsModel.findOne({ id: id }).exec();
            if (chat) {
                if (chat.users.length === 2) {
                    const otherUserPhone = res.locals.userOnSession === chat.users[0] ? chat.users[1] : chat.users[0];
                    const otherUser = await usersModel.find({ phone: otherUserPhone }).exec();
                    chat.name = `${otherUser[0].name} ${otherUser[0].surname}`;
                }
                res.status(200).json(chat);
            } else {
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
});

// it modifies the chat with this id. New data are passed by body.
// Body must have at lest a not empty field, otherwise it will return an error.
// It returns a chat before and after modifying operation.
// Chat before modifying is useful for client forms.
router.put('/:id', authorization, [
    param('id')
        .isNumeric(),
    body('description')
        .isString(),
    body('name')
        .isString(),
    sanitizeParam('id').toInt()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
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
        mongoDBConnection();
        const id = req.params.id;

        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values next to a <<then>> method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            const originalChat = await chatsModel.findOne({ id: id }).exec();
            if (description !== "") {
                const chat = await chatsModel.findOneAndUpdate({ id: id },
                    { description: description }, {
                    new: true
                });
            }
            if (name !== "") {
                const chat = await chatsModel.findOneAndUpdate({ id: id },
                    { name: name }, {
                    new: true
                });
            }
            const modifiedChat = await chatsModel.findOne({ id: id }).exec();
            res.status(200).json({ "chat": originalChat, "modifiedChat": modifiedChat });
        }
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// it adds a message, by body, to a chat by id. 
// It returns this chat document after this operation.
router.put('/:id/add-message', authorization, [
    param('id')
        .isNumeric(),
    body('sender')
        .trim()
        .isString(),
    body('body')
        .trim()
        .isString(),
    sanitizeParam('id').toInt()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!req.body.sender && !req.body.body) {
        return res.status(400).json({ Error: "Sender and body are required" });
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { sender, body } = req.body;
    try {
        mongoDBConnection();

        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new message will be added to chat messages array just once. Without 
        // them, it will happen twice and the whole messages array could be overwritten.
        let date = new Date();
        let chat = await chatsModel.findOneAndUpdate(
            { id: id },
            { $push: { "messages": { sender: sender, body: body, date: date } } },
            { upsert: true, new: true }).exec();
        if (chat) {
            return res.status(200).json(chat);
        } else {
            return res.status(500).send("error!!!");
        }
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// It removes a chat
router.delete('/:id', authorization, [
    param('id')
        .isNumeric(),
    sanitizeParam('id').toInt()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    if (res.locals.userOnSession) {
        try {
            mongoDBConnection();
            let chat = await chatsModel.findOneAndRemove({ id: id }).exec();
            res.status(200).json({
                message: "chat deleted successfully",
                chat: chat
            });
        } catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    } else {
        return res.status(500).send("Error: there's a problem about res.locals.userOnSession");
    }
});

// it creates a new chat document and returns that
router.post('/', authorization, [
    body('description')
        .trim()
        .isString(),
    body('name')
        .trim()
        .isString()
        .not().isEmpty(),
    body('users')
        .trim()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if (res.locals.userOnSession) {
        const { name, description } = req.body;
        let usersBody = req.body.users;
        let users = usersBody.split(',');

        users.push(res.locals.userOnSession);
        let admin: string[] = [];
        admin.push(res.locals.userOnSession);

        let messages: Object[] = [];
        // unique numeric id creation
        let d = new Date();
        let id = d.valueOf();
        try {
            mongoDBConnection();
            let chat = new chatsModel({ id, description, name, users, admin, messages });
            chat.save(err => {
                if (err) return res.status(500).send(err);
                return res.status(200).json(chat);
            });
        } catch (err) {
            return res.status(500).send(`Unexpected error: ${err}`);
        }
    } else {
        return res.status(500).send("Error: There's a problem about res.locals.userOnSession");
    }
});

export default router;