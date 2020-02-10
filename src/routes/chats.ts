import express from 'express';
import { body, param, validationResult, sanitizeParam, query } from 'express-validator';
import { userOnSession, authorization } from './users';

/*import {
    getAllChats,
    getInfoByChatId,
    getMessagesByChatId,
    getUsersByChatId,
    changeInfoByChatId,
    addChat,
    removeChatById,
    searchByChatId,
    addNewMessageByChatId
} from '../lib/chats';*/

const router = express.Router();

/*
//GET - url: /, stampa tutte le chat
router.get('/', authorization, async (req: any, res: any) => {
    try {
        let chats;
        if (userOnSession) {
            chats = await getAllChats(userOnSession);
        }
        else chats = await getAllChats();
        res.json(chats);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', [
    param('id')
        .isNumeric(),
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
        .isNumeric(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    try {
        let info;
        if (userOnSession) {
            info = await getInfoByChatId(id, userOnSession);
        }
        else info = await getInfoByChatId(id);
        if (info == false) return res.status(404).send(`Chat not found.`);
        res.json(info);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', [
    param('id')
        .isNumeric(),
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
        .isNumeric(),
    body('description')
        .trim()
        .isString(),
    body('name')
        .trim()
        .isString(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!req.body.description && !req.body.name) return res.status(400).json({ errors: "Name or description are required" })
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

//PUT - url: /:id/messages + BODY, aggiunge un messaggio in una chat.
router.put('/:id/messages', authorization, [
    param('id')
        .isNumeric(),
    body('sender')
        .trim()
        .isString(),
    body('body')
        .isString(),
    body('date')
        .isString(),
    sanitizeParam('id').toInt()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!req.body.sender && !req.body.body && !req.body.date) return res.status(400).json({ errors: "Sender, body and date are required" })
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { sender, body, date } = req.body;
    try {
        const result = await addNewMessageByChatId(id, sender, body, date);
        if (result == false) return res.status(404).send(`The message isn't delivered.`);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//POST - url: / + BODY, aggiunge una chat.
router.post('/', authorization, [
    body('description')
        .trim()
        .isString(),
    body('name')
        .trim()
        .isString()
        .not().isEmpty(),
    body('users')
        .trim()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    let usersBody = req.body.users;
    let users = usersBody.split(',');
    users.push(userOnSession.phone);


    let admin: string[] = [];
    admin.push(userOnSession.phone);

    try {
        const result = await addChat(name, description, users, admin);
        if (result == false) return res.status(404).send(`Chat not found.`);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//DELETE - url: /:id, cancella la chat avendo l'id.
router.delete('/:id', [
    param('id')
        .isNumeric(),
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
*/
export default router;