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
//Cluster: /users
//GET - url: /, stampa tutti gli utenti.
router.get('/', (req, res) => {
    res.json(stevygram.getAllUsers());
});
//PUT
//- url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', (req, res) => {
    let phone = req.params.phone;
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    res.json(stevygram.changeUserByPhone(nickname, name, surname, phone));
});
//POST 
//- url: /, aggiunge un utente nell'app + BODY.
router.post('/', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    let phone = req.body.phone;
    res.json(stevygram.addUser(nickname, name, surname, phone));
});
//DELETE 
//- url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', (req, res) => {
    let phone = req.params.phone;
    res.json(stevygram.removeUserByPhone(phone));
});
module.exports = router;
//# sourceMappingURL=users.js.map