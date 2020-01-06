import express from 'express';
import { User, getAllUsers, addUser, changeUserByPhone, removeUserByPhone, findUserByPhone, getPhonebookInfoByPhone } from '../lib/users';
import { body, param, validationResult, query } from 'express-validator';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express-serve-static-core';
import bcrypt from 'bcrypt';

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

export default router; 