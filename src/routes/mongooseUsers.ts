import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {
    User,
    findUserByPhone,
    addInPhonebookByPhone,
} from '../lib/users';

// this statement prints plain mongoDB queries on terminal
mongoose.set('debug', true);

// defining users collection schema and model
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    //_id: mongoose.Types.ObjectId,
    name: String,
    surname: String,
    nickname: String,
    phone: String,
    password: String,
    phonebook: [String]
});
let usersModel = mongoose.model<User>("user", usersSchema);

const router = express.Router();
export let userOnSession: User;
const privateKey = "MIIBPAIBAAJBAKcm16uoSgb36jlNsApBQf36uz17EPbkRLWAbW+8oQs2qExo68QBvNQWrriPnmOdYgmJrBJZCw9nbIEne5eRZKcCAwEAAQJBAII/pjdAv86GSKG2g8K57y51vom96A46+b9k/+Hd3q/Y+Mf4VxaXcMk8VkdQbY4zCkQCgmdyB8zAhIoobikU3CECIQDXxsKDIuXbt/V/+s7YyJS87JO87VAc01kEzKzhxRgfkwIhAMZPoAl4JpHsHsdgYPXln4L4SEEbL/R6DfUdvtXPK4sdAiEAv9V0bxPimVHWUF6R8Ud6fPAzdJ7jP41ishKpjNsmVEMCIQCZt77lmCzNj6mMAjkmYgdzDeF0Fg7mAnYvOg9izGOEQQIgchiD1OLZQCUuETiBiOLJ9NWWVWK5enEK4JhI3fj/teQ=";
export const authorization = async (req: any, res: any, next: NextFunction) => {
    try {
        let token = req.query.token;
        let legit = jwt.verify(token, privateKey);
        const user = await findUserByPhone(Object.values(legit)[0]);
        if (user) {
            userOnSession = user;
            next();
        }
    } catch (error) {
        return res.status(500).send(`Unexpected error: ${error}`);
    }
};

export const usersMongoDBConnection = async () => {
    const host = "mongodb+srv://matteo:stevygram@cluster0-q7lqh.mongodb.net/stevygram0?retryWrites=true&w=majority";
    mongoose.connect(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var db = mongoose.connection;
    db.on('error', function () {
        console.error('Connection	error!\n');
    });
    db.once('open', function () {
        console.log('DB	connection	Ready\n');
        //console.log(mongoose.connection.db.collections()); // [{ name: 'dbname.myCollection' }]
    });
};

// it returns all users
router.get('/', [
], async (req: any, res: any) => {
    try {
        usersMongoDBConnection();
        usersModel.find((err: any, users: any) => {
            if (err) {
                res.send("Error!");
            } else {
                res.send(users);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it returns the users with this phone
router.get('/:phone', [
    param('phone')
        .isString()
        .trim()
], async (req: any, res: any) => {
    try {
        usersMongoDBConnection();
        let phone = req.params.phone;
        usersModel.find({ phone: phone }, (err: any, users: any) => {
            if (err) {
                res.send("Error!");
            } else {
                res.send(users);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it returns all users with this name
router.get('/:name', [
    param('phone')
        .isString()
        .trim()
], async (req: any, res: any) => {
    try {
        usersMongoDBConnection();
        let name = req.params.name;
        usersModel.find({ name: name }, (err: any, users: any) => {
            if (err) {
                res.send("Error!");
            } else {
                res.send(users);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it modifies the user with this phone. You pass new values by body
router.put('/:phone', [
    param('phone')
        .isString()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone; // param
    const { nickname, name, surname } = req.body; // body
    if (!nickname && !name && !surname) {
        return res.status(400).json({ errors: "Nickname or fullname (name, surname) are required" });
    }
    try {
        usersMongoDBConnection();
        const filter = { phone: phone };
        const update = {
            nickname: nickname,
            name: name,
            surname: surname
        };
        // doc is the found document after updating was applied because of <<new: true>>
        let doc = await usersModel.findOneAndUpdate(filter, update, {
            new: true
        });
        res.send(doc);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// it adds a new phone to an user's phonebook
router.put('/add-contact/:userPhone', [
    param('userPhone')
        .isString()
        .trim(),
    body('newPhone')
        .isString()
        .not().isEmpty()
        .trim(),
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userPhone = req.params.userPhone;
    const newPhone = req.body.newPhone;
    try {
        usersMongoDBConnection();
        const filter = { phone: userPhone };
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new contact will be added to user's phonebook just once. Without 
        // them, it will happen twice and the whole phonebook could be overwritten.
        let doc = await usersModel.findOneAndUpdate(filter,
            { $push: { phonebook: newPhone } }, { upsert: true, new: true },
            (err, user) => {
                if (err) {
                    res.status(500).json({ "error": err });
                } else {
                    res.status(200).json({ "addingContactLog": user });
                }
            });
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it inserts a new user in database by body
router.post('/', [
    body('nickname')
        .isString()
        .not().isEmpty()
        .trim(),
    body('name')
        .isString()
        .not().isEmpty()
        .trim(),
    body('surname')
        .isString()
        .not().isEmpty()
        .trim(),
    body('phone')
        .isString()
        .not().isEmpty()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { nickname, name, surname, phone } = req.body;
    console.log("I'm here");
    try {
        usersMongoDBConnection();
        let addingUser = new usersModel(req.body);
        addingUser.save(err => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(addingUser);
        });
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it deletes the user with this phone
router.delete('/:phone', [
    param('phone')
        .isString()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let phone = req.params.phone;
    try {
        usersMongoDBConnection();
        await usersModel.findOneAndRemove({ phone: phone },
            (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
                const response = {
                    message: "Todo successfully deleted",
                    userDeleted: user
                };
                return res.status(200).send(response);
            });
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it deletes a contanct from an user's phonebook
router.delete('/remove-contact/:userPhone', [
    param('userPhone')
        .isString()
        .trim(),
    body('contactPhone')
        .isString()
        .not().isEmpty()
        .trim(),
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userPhone = req.params.userPhone;
    const contactPhone = req.body.contactPhone;
    try {
        usersMongoDBConnection();
        const filter = { phone: userPhone };
        // just like post(/add-contact/:phone) case, but we use $pull operator
        // because we are removing an element from an array.
        let doc = await usersModel.findOneAndUpdate(filter,
            { $pull: { phonebook: contactPhone } }, { upsert: true, new: true },
            (err, user) => {
                if (err) {
                    res.status(500).json({ "error": err });
                } else {
                    res.status(200).json({ "removingContactLog": user });
                }
            });
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

router.get("/test", (q, s, n) => {
    //Using MongoClient
    /*
    MongoClient.connect(host, function (err: any, db: any) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection("users").find().toArray(function (err: any, result: any) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
    */
});

export default router;