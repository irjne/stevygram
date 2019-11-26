import express, { RouterOptions } from 'express';
import {
    getAllChats,
    getInfoByChatId,
    getMessagesByChatId,
    getUsersByChatId,
    changeInfoByChatId,
    addChat,
    removeChatById
} from '../index';
import { resolveSoa } from 'dns';

const router = express.Router();

//GET - url: /, stampa tutte le chat
router.get('/', async (req, res) => {
    try{
        const result = await getAllChats();
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', (req, res) => {
    let id = Number(req.params.id);
    
    try {
        const result = await getUsersByChatId(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//- url: /:id, stampa tutti i dati di una chat;
router.get('/:id', (req, res) => {
    let id = Number(req.params.id);
    
    try {
        const result = await getInfoByChatId(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', (req, res) => {
    let id = Number(req.params.id);
    
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
router.put('/:id', (req, res) => {
    const {id, description, name} = req.body;
    
    try {
        const result = await changeInfoByChatId(id, name, description);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//POST - url: / + BODY, aggiunge una chat.
router.post('/', (req, res) => {
    const {id, name, description, users} = req.body;
    const usersArray = users.split(users, ", ");
    
    try {
        const result = await addChat(id, name, description, usersArray);
        res.json (result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//DELETE - url: /:id, cancella la chat avendo l'id.
router.delete('/:id', (req, res) => {
    let id = Number(req.params.id);
    
    try {
        const result = await removeChatById(id);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

export default router; 