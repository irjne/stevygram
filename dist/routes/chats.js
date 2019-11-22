"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//TODO riga dove importare index.ts e tutte le classe con il require
const router = express_1.default.Router();
//Cluster: /chats
//GET
//- url: /, stampa tutte le chat
router.get('/', (req, res) => {
    res.json(stevyGram.getAllChats());
});
//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', (req, res) => {
    let id = req.params.id;
    res.json(stevyGram.getUsersByChatId(id));
});
//- url: /:id, stampa tutti i dati di una chat;
router.get('/:id', (req, res) => {
    let id = req.params.id;
    res.json(stevyGram.getAllInfoByChatId(id));
});
// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', (req, res) => {
    let id = req.params.id;
    res.json(stevyGram.getAllMessagesByChatId(id));
});
//filter: ?word="pippo", stampa tutti i messaggi contenenti la parola; filter: ?user="id", 
// stampa tutti i messaggi di un determinato utente.
// TODO FILTRIII dentro api di sopra
//PUT
//- url: /:id + BODY, modifica una chat dando un id.
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let description = req.body.description;
    let name = req.body.name;
    res.json(stevyGram.changeInfoByChatId(id, name, description));
});
//POST
//- url: / + BODY, aggiunge una chat.
router.post('/', (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let usersTemp = req.body.users;
    let users = [];
    users = usersTemp.split(usersTemp, ", ");
    for (let i = 0; i < users.length; i++) {
    }
    res.json(stevyGram.addNewChat(name, description)); //manca il parametro users));
});
//DELETE
//- url: /:id, cancella la chat avendo l'id.
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    res.json(stevyGram.removeChatById(id));
});
//# sourceMappingURL=chats.js.map