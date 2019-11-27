import express from 'express';
import { body, param, validationResult, sanitizeParam, query } from 'express-validator';
import {
    getAllChats,
    getInfoByChatId,
    getMessagesByChatId,
    getUsersByChatId,
    changeInfoByChatId,
    addChat,
    removeChatById,
    searchByChatId,
    findUserByPhone
} from '../index';
import { NextFunction } from 'express-serve-static-core';

const router = express.Router();

const middleware = async (req: any, res: any, next: NextFunction) => {
    console.log('sto passando dal middleware');
    if (req.query.user) {
        res.locals.user = await findUserByPhone(req.query.user);
    }
    next();
}

//GET - url: /, stampa tutte le chat
router.get('/', middleware, async (req: any, res: any) => {
    try {
        const result = await getAllChats(res.locals.user);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    try {
        const result = await getUsersByChatId(id);
        if (result == false) return res.status(404).send("Chat not found.");
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    try {
        const result = await getInfoByChatId(id);
        if (result == false) return res.status(404).send(`Chat not found.`);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { sender, word } = req.query;

    //filter: ?word="pippo", stampa tutti i messaggi contenenti la parola; 
    if (req.query.word) {
        try {
            const result = await searchByChatId(id, undefined, word);
            if (result == false) return res.status(404).send(`Chat not found.`);
            res.json(result);
        } catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }

    //filter: ?sender="id", stampa tutti i messaggi di un determinato utente.
    else if (req.query.sender) {
        try {
            const result = await searchByChatId(id, sender);
            if (result == false) return res.status(404).send(`Chat not found.`);
            res.json(result);
        } catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }
    else {
        try {
            const result = await getMessagesByChatId(id);
            if (result == false) return res.status(404).send(`Chat not found.`);
            res.json(result);
        } catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { description, name } = req.body;
    try {
        const result = await changeInfoByChatId(id, name, description);
        if (result == false) return res.status(404).send(`Chat not found.`);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { id, name, description, users } = req.body;
    const usersArray = users.split(users, ", ");

    try {
        const result = await addChat(id, name, description, usersArray);
        if (result == false) return res.status(404).send(`Chat not found.`);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;

    try {
        const result = await removeChatById(id);
        if (result == false) return res.status(404).send(`Chat not found.`);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

export default router; 