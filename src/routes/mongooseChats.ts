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
        // sends all chats collection
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

    try {
        if (res.locals.userOnSession) {
            // sends user's chats
            let users = await chatsModel.findOne({ id: id }, 'users',
                (err: any, chats: any) => {
                    if (err) res.send("Error!");
                    else res.send(users);
                }
            )
        }
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

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

export default router;