import express from 'express';
import { body, param, validationResult, sanitizeParam, query } from 'express-validator';
import { } from './users';
import mongoose from 'mongoose';
import { Chat, Message } from '../lib/chats';
import { mongoDBConnection, authorization } from './mongooseUsers';
import bcrypt from 'bcrypt';

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

//- url: /:id/users, stampa tutti gli utenti di una chat;
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
    console.log(id);
    try {
        console.log(res.locals.userOnSession);
        if (res.locals.userOnSession) {
            // sends user's chats
            let users = await chatsModel.findOne({ id: id }, 'users',
                (err: any, data: any) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    else {
                        res.status(200).send(data);
                        return;
                    }
                }
            );
        } else {
            return res.status(500).send("Error: problem with res.locals.userOnSession");
        }
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})


export default router;