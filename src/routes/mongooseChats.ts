import express from 'express';
import { body, param, validationResult, sanitizeParam, query } from 'express-validator';
import { } from './users';
import mongoose from 'mongoose';
import { Chat, Message } from '../lib/chats';
import { mongoDBConnection, authorization } from './mongooseUsers';
import bcrypt from 'bcrypt';
import { isArray } from 'util';

// this statement prints plain mongoDB queries on terminal
mongoose.set('debug', true);

// defining schema and model of users collection
const Schema = mongoose.Schema;
const messagesSchema = new Schema({
    sender: String,
    body: String,
    date: Date
});

let messagesModel = mongoose.model<Message>("message", messagesSchema);

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
router.get('/', authorization, async (req: any, res: any) => {
    try {
        mongoDBConnection();
        let chats: Chat[];
        if (res.locals.userOnSession) {
            // sends user's chats
            chats = await chatsModel.find({ users: { "$in": [res.locals.userOnSession] } },
                (err: any, chats: any) => {
                    if (err) res.send("Error!");
                    else res.send(chats);
                }
            )
        }
        // sends whole chats collection
        else chats = await chatsModel.find((err: any, chats: any) => {
            if (err) {
                res.send("Error!");
            } else {
                res.send(chats);
            }
        })
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// returns all user phones of a chat by its id
router.get('/:id/users', [
    param('id')
        .isNumeric(),
    sanitizeParam('id').toInt()
], authorization, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongoDBConnection();
    const id = req.params.id;
    console.log("chat id: " + id);
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let users: any;
            users = await chatsModel.findOne({ id: id }, 'users').exec();
            if (users) {
                res.status(200).send(users);
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
], authorization, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongoDBConnection();
    const id = req.params.id;
    console.log("chat id: " + id);
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let messages: any;
            messages = await chatsModel.findOne({ id: id }, 'messages').exec();
            if (messages) {
                res.status(200).send(messages);
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
], authorization, async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    mongoDBConnection();
    const id = req.params.id;
    console.log("chat id: " + id);
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let chat: any;
            chat = await chatsModel.findOne({ id: id }).exec();
            if (chat) {
                res.status(200).send(chat);
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
// Body must not have any empty field, otherwise it will save "" values.
// It returns a chat before and after modifying operation.
// Chat before modifying is useful for client forms.
router.put('/:id', authorization, [
    param('id')
        .isNumeric(),
    body('description')
        .trim()
        .isString(),
    body('name')
        .trim()
        .isString(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
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
        console.log("chat id: " + id);
        if (res.locals.userOnSession) {
            // Mongoose async operations, like .save() and generic queries, 
            // return thenables (i.e. values with a "then" method). 
            // This means that you can do things like MyModel.findOne({}).then() 
            // and await MyModel.findOne({}).exec() if you're using async/await.
            let chat: any;
            chat = await chatsModel.findOne({ id: id }).exec();
            const modifyingChat = await chatsModel.findOneAndUpdate({ id: id },
                { description: description, name: name }, {
                new: true
            });
            res.status(200).json({ "chat": chat, "modifyingChat": modifyingChat });
        }
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// //PUT - url: /:id/messages + BODY, aggiunge un messaggio in una chat.
// router.put('/:id/messages', authorization, [
//     param('id')
//         .isNumeric(),
//     body('sender')
//         .trim()
//         .isString(),
//     body('body')
//         .isString(),
//     body('date')
//         .isString(),
//     sanitizeParam('id').toInt()
// ], async (req: any, res: any) => {
//     const errors = validationResult(req);
//     if (!req.body.sender && !req.body.body && !req.body.date) return res.status(400).json({ errors: "Sender, body and date are required" })
//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     }

//     const id = req.params.id;
//     const { sender, body, date } = req.body;
//     try {
//         const result = await addNewMessageByChatId(id, sender, body, date);
//         if (result == false) return res.status(404).send(`The message isn't delivered.`);
//         res.json(result);
//     } catch (err) {
//         return res.status(400).send(`Unexpected error: ${err}`);
//     }
// })

export default router;