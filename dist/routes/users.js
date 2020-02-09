"use strict";
/*
import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import {
    User,
    getAllUsers,
    addUser,
    changeUserByPhone,
    removeUserByPhone,
    findUserByPhone,
    getPhonebookInfoByPhone,
    addInPhonebookByPhone,
    removeInPhonebookByPhone
} from '../lib/users';

mongoose.set('debug', true);
const Schema = mongoose.Schema;
// Defining users collection schema and model
const usersSchema = new Schema({
    _id: mongoose.Types.ObjectId,
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
}

//GET - url: /, ritorna tutti gli utenti.
router.get('/', authorization, [
    query('name')
        .isString()
        .trim()
], async (req: any, res: any) => {
    try {
        if (userOnSession) { //verificare il funzionamento di locals
            const phonebook = await getPhonebookInfoByPhone(userOnSession.phone);
            res.json(phonebook);
        }
        else {
            const users = await getAllUsers(req.query.name);
            res.json(users);
        }
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
})

//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', [
    param('phone')
        .isString()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const phone = req.params.phone;
    const { nickname, name, surname } = req.body;
    if (!nickname && !name && !surname) {
        return res.status(400).json({ errors: "Nickname or full name (name, surname) are required" });
    }

    try {
        const result = await changeUserByPhone(phone, nickname, name, surname);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//POST - url: /, aggiunge un utente nell'app + BODY.
router.post('/',
    [
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
            .trim(),
        body('password')
            .isString()
            .not().isEmpty()
            .trim()
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { nickname, name, surname, phone, password } = req.body;
        try {
            const result = await addUser(nickname, name, surname, phone, password);
            res.json(result);
        } catch (err) {
            return res.status(500).send(`Unexpected error: ${err}`);
        }
    })

//POST - url: /add-contact, aggiunge un utente in una rubrica + BODY.
router.post('/add-contact', authorization,
    [
        body('phone')
            .isString()
            .not().isEmpty()
            .trim(),
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const phone = req.body.phone;
        try {
            const result = await addInPhonebookByPhone(userOnSession.phone, phone);
            res.json(result);
        } catch (err) {
            return res.status(500).send(`Unexpected error: ${err}`);
        }
    })

//DELETE - url: /:id, cancella l'utente avendo l'id.
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
        const result = await removeUserByPhone(phone);
        res.json(result);
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
})

//DELETE - url: /:phone, cancella l'utente da una rubrica avendo il numero di telefono.
router.delete('/remove-contact/:phone', authorization, [
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
        const result = await removeInPhonebookByPhone(userOnSession.phone, phone);
        res.json(result);
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
})

router.post('/login', [
    body('phone')
        .isString()
        .trim(),
    body('password')
        .isString()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const phone = req.body.phone;
        const password = req.body.password;
        let foundUser = await findUserByPhone(phone);
        let user;

        const passwordVerification = await bcrypt.compare(password, foundUser.password);

        if (passwordVerification) {
            user = foundUser;
        } else {
            return res.status(401).send(`Login credentials aren't valid. Please, try again.`);
        }
        const payload = {
            phone: user.phone,
            password: user.password
        };
        var token = jwt.sign(payload, privateKey);
        return res.status(201).json(token);
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
})

router.get("/test", (q, s, n) => {
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


    usersModel.find((err: any, users: any) => {
        if (err) {
            s.send("Error!");
        } else {
            s.send(users);
        }
    });

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
/*
});

export default router;
*/ 
//# sourceMappingURL=users.js.map