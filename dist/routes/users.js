"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
//GET - url: /, stampa tutti gli utenti.
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    index_1.getAllUsers().then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
}));
//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let phone = req.params.phone;
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    index_1.changeUserByPhone(nickname, name, surname, phone).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
}));
//POST - url: /, aggiunge un utente nell'app + BODY.
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let name = String(req.body.name);
    let surname = String(req.body.surname);
    let nickname = String(req.body.nickname);
    let phone = String(req.body.phone);
    index_1.addUser(nickname, name, surname, phone).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
}));
//DELETE - url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let phone = String(req.params.phone);
    console.log(phone);
    index_1.removeUserByPhone(phone).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map