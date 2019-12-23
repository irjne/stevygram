import express from 'express';
import { getAllUsers, addUser, changeUserByPhone, removeUserByPhone } from '../lib/users';
import { body, param, validationResult, query } from 'express-validator';
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
        return res.status(400).json({ errors: 'Missing params: ...' });
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

export default router; 