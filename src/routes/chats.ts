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

const router = express.Router();

//GET - url: /, stampa tutte le chat
router.get('/', async (req, res) => {

    getAllChats().then(res => {
        return res.json(res);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
})

//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', (req, res) => {
    let id = Number(req.params.id);
    let result = getUsersByChatId(id);

    if (typeof (result) == "object") return res.json(result);
    return res.status(404).send("Unexpected error.");
})

//- url: /:id, stampa tutti i dati di una chat;
router.get('/:id', (req, res) => {
    let id = Number(req.params.id);
    res.json(getInfoByChatId(id));
})

// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', (req, res) => {
    let id = Number(req.params.id);
    res.json(getMessagesByChatId(id));

    //TODO: filter: ?word="pippo", stampa tutti i messaggi contenenti la parola; 
    //TODO: filter: ?user="id", stampa tutti i messaggi di un determinato utente.
})

//PUT - url: /:id + BODY, modifica una chat dando un id.
router.put('/:id', (req, res) => {
    let id = Number(req.params.id);
    let description = req.body.description;
    let name = req.body.name;
    res.json(changeInfoByChatId(id, name, description));
})

//POST - url: / + BODY, aggiunge una chat.
router.post('/', (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let users = req.body.users;
    users = users.split(users, ", ");

    res.json(addChat(name, description, users));
})

//DELETE - url: /:id, cancella la chat avendo l'id.
router.delete('/:id', (req, res) => {
    let id = Number(req.params.id);
    res.json(removeChatById(id));
})

export default router; 