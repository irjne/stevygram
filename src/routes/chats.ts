import express from 'express';
import { body, param, validationResult, sanitizeParam } from 'express-validator';
import {
    getAllChats,
    getInfoByChatId,
    getMessagesByChatId,
    getUsersByChatId,
    changeInfoByChatId,
    addChat,
    removeChatById
} from '../index';

const router = express.Router();

//GET - url: /, stampa tutte le chat
router.get('/', async (req: any, res: any) => {
    try {
        const result = await getAllChats();
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', [
    param('id')
        .isNumeric()
        .not().isEmpty(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    try {
        const result = await getUsersByChatId(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//- url: /:id, stampa tutti i dati di una chat;
router.get('/:id', [
    param('id')
        .isNumeric()
        .not().isEmpty(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    try {
        const result = await getInfoByChatId(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', [
    param('id')
        .isNumeric()
        .not().isEmpty(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    try {
        const result = await getMessagesByChatId(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }

    //TODO: filter: ?word="pippo", stampa tutti i messaggi contenenti la parola; 
    //TODO: filter: ?user="id", stampa tutti i messaggi di un determinato utente.
})

//PUT - url: /:id + BODY, modifica una chat dando un id.
router.put('/:id', [
    param('id')
        .isNumeric()
        .not().isEmpty(),
    body('description')
        .trim()
        .isString(),
    body('name')
        .trim()
        .isString()
        .not().isEmpty(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { description, name } = req.body;
    try {
        const result = await changeInfoByChatId(id, name, description);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//POST - url: / + BODY, aggiunge una chat.
router.post('/', [
    param('id')
        .isNumeric()
        .not().isEmpty(),
    body('description')
        .trim()
        .isString(),
    body('name')
        .trim()
        .isString()
        .not().isEmpty(),
    body('users')
        .isString()
        .trim(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { id, name, description, users } = req.body;
    const usersArray = users.split(users, ", ");

    try {
        const result = await addChat(id, name, description, usersArray);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//DELETE - url: /:id, cancella la chat avendo l'id.
router.delete('/:id', [
    param('id')
        .isNumeric()
        .not().isEmpty(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;

    try {
        const result = await removeChatById(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

export default router; 