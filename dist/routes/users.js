"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//TODO riga dove importare index.ts e tutte le classe con il require
const router = express_1.default.Router();
//Cluster: /users
//GET - url: /, stampa tutti gli utenti.
router.get('/', (req, res) => {
    res.json(stevyGram.getAllUsers());
});
//PUT
//- url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', (req, res) => {
    let phone = req.params.phone;
    let name = req.body.name;
    let surname = req.body.surname;
    let nickName = req.body.nickName;
    res.json(stevyGram.changeUserByPhone(phone, name, surname, nickName));
});
//POST 
//- url: /, aggiunge un utente nell'app + BODY.
router.post('/', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let nickName = req.body.nickName;
    let phone = req.body.phone;
    res.json(stevyGram.addNewUser(phone, name, surname, nickName));
});
//DELETE 
//- url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', (req, res) => {
    let phone = req.params.phone;
    res.json(stevyGram.removeUserByPhone(phone));
});
module.exports = router;
//# sourceMappingURL=users.js.map