import express from 'express';
import { getAllUsers, addUser, changeUserByPhone, removeUserByPhone } from '../index';
import { body, param, validationResult } from 'express-validator';
const router = express.Router();

//GET - url: /, stampa tutti gli utenti.
router.get('/', async (req: any, res: any) => {
    try {
        const result = await getAllUsers();
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', [
    body('nickname')
        .isString()
        .trim(),
    body('name')
        .isString()
        .trim(),
    body('surname').isString()
        .trim(),
    param('phone')
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
        const result = await changeUserByPhone(nickname, name, surname, phone);
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
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//DELETE - url: /:id, cancella l'utente avendo l'id.
router.delete('/:phone', [
    param('phone')
        .isString()
        .not().isEmpty()
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let phone = String(req.params.phone);
    try {
        const result = await removeUserByPhone(phone);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

export default router; 