"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stevygram = __importStar(require("../index"));
const router = express_1.default.Router();
//Cluster: /chats
//GET
//- url: /, stampa tutte le chat
router.get('/', (req, res) => {
    res.json(stevygram.getAllChats());
});
//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', (req, res) => {
    let id = Number(req.params.id);
    let result = stevygram.getUsersByChatId(id);
    if (typeof (result) == "object")
        return res.json(result);
    return res.status(404).send("Unexpected error.");
});
//- url: /:id, stampa tutti i dati di una chat;
router.get('/:id', (req, res) => {
    let id = Number(req.params.id);
    res.json(stevygram.getInfoByChatId(id));
});
// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', (req, res) => {
    let id = Number(req.params.id);
    res.json(stevygram.getMessagesByChatId(id));
});
//filter: ?word="pippo", stampa tutti i messaggi contenenti la parola; filter: ?user="id", 
// stampa tutti i messaggi di un determinato utente.
// TODO FILTRIII dentro api di sopra
//PUT
//- url: /:id + BODY, modifica una chat dando un id.
router.put('/:id', (req, res) => {
    let id = Number(req.params.id);
    let description = req.body.description;
    let name = req.body.name;
    res.json(stevygram.changeInfoByChatId(id, name, description));
});
//POST
//- url: / + BODY, aggiunge una chat.
router.post('/', (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let users = req.body.users;
    users = users.split(users, ", ");
    res.json(stevygram.addChat(name, description, users));
});
//DELETE
//- url: /:id, cancella la chat avendo l'id.
router.delete('/:id', (req, res) => {
    let id = Number(req.params.id);
    res.json(stevygram.removeChatById(id));
});
//# sourceMappingURL=chats.js.map