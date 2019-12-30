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
const users_1 = require("../lib/users");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
//GET - url: /, ritorna tutti gli utenti.
router.get('/', [
    express_validator_1.query('name')
        .isString()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.getAllUsers(req.query.name);
        res.json(users);
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    const { nickname, name, surname } = req.body;
    if (!nickname && !name && !surname) {
        return res.status(400).json({ errors: "Nickname or full name (name, surname) are required" });
    }
    try {
        const result = yield users_1.changeUserByPhone(phone, nickname, name, surname);
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
//POST - url: /, aggiunge un utente nell'app + BODY.
router.post('/', [
    express_validator_1.body('nickname')
        .isString()
        .not().isEmpty()
        .trim(),
    express_validator_1.body('name')
        .isString()
        .not().isEmpty()
        .trim(),
    express_validator_1.body('surname')
        .isString()
        .not().isEmpty()
        .trim(),
    express_validator_1.body('phone')
        .isString()
        .not().isEmpty()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, phone, surname, nickname } = req.body;
    try {
        const result = yield users_1.addUser(nickname, name, surname, phone);
        res.json(result);
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
//DELETE - url: /:id, cancella l'utente avendo l'id.
router.delete('/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let phone = req.params.phone;
    try {
        const result = yield users_1.removeUserByPhone(phone);
        res.json(result);
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
router.post('/login/:phone/:name', [
    express_validator_1.param('phone')
        .isString()
        .trim(),
    express_validator_1.param('name')
        .isString()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let name = req.params.name;
    let phone = req.params.phone;
    const result = yield users_1.findUserByPhone(phone);
    //console.log(result);
    let user;
    try {
        if (result.name == name) {
            user = result;
        }
        else {
            return res.status(401);
        }
        const payload = {
            phone: user.phone,
            password: user.name
        };
        //console.log(payload);
        var i = "Mysoft corp"; // Issuer
        var s = "some@user.com"; // Subject
        var a = "http://mysoftcorp.in"; // Audience// SIGNING OPTIONS
        var signOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "12h",
            algorithm: "RS256"
        };
        const privateKey = "MEgCQQCnJterqEoG9+o5TbAKQUH9+rs9exD25ES1gG1vvKELNqhMaOvEAbzUFq64j55jnWIJiawSWQsPZ2yBJ3uXkWSnAgMBAAE=";
        var token = jsonwebtoken_1.default.sign(payload, privateKey);
        //console.log("Token - " + token);
        return res.status(201).json({ token: token });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map