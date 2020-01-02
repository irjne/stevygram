import express from 'express';
import { getAllUsers, addUser, changeUserByPhone, removeUserByPhone, findUserByPhone } from '../lib/users';
import { body, param, validationResult, query } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();

//GET - url: /, ritorna tutti gli utenti.
router.get('/', [
    query('name')
        .isString()
        .trim()
], async (req: any, res: any) => {
    try {
        const users = await getAllUsers(req.query.name);
        res.json(users);
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

    const { name, phone, surname, nickname } = req.body;
    try {
        const result = await addUser(nickname, name, surname, phone);
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

router.post('/login/:phone/:name', [
    param('phone')
        .isString()
        .trim(),
    param('name')
        .isString()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let name = req.params.name;
    let phone = req.params.phone;
    const result = await findUserByPhone(phone);
    //console.log(result);
    let user;
    try {
        if (result.name == name) {
            user = result;
        } else {
            return res.status(401).send(`Login credentials arent' valid. Please, try again.`);
        }
        const payload = {
            phone: user.phone,
            password: user.name
        };
        //console.log(payload);
        var i = "Mysoft corp"; // Issuer
        var s = "some@user.com"; // Subject
        var a = "http://mysoftcorp.in"; // Audience// SIGNING OPTIONS
        var signOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "12h",
            algorithm: "RS256"
        };
        const privateKey = "MEgCQQCnJterqEoG9+o5TbAKQUH9+rs9exD25ES1gG1vvKELNqhMaOvEAbzUFq64j55jnWIJiawSWQsPZ2yBJ3uXkWSnAgMBAAE=";
        var token = jwt.sign(payload, privateKey);
        //console.log("Token - " + token);

        return res.status(201).json(token);
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
})

export default router; 