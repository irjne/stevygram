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
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../lib/users");
const router = express_1.default.Router();
const privateKey = "MIIBPAIBAAJBAKcm16uoSgb36jlNsApBQf36uz17EPbkRLWAbW+8oQs2qExo68QBvNQWrriPnmOdYgmJrBJZCw9nbIEne5eRZKcCAwEAAQJBAII/pjdAv86GSKG2g8K57y51vom96A46+b9k/+Hd3q/Y+Mf4VxaXcMk8VkdQbY4zCkQCgmdyB8zAhIoobikU3CECIQDXxsKDIuXbt/V/+s7YyJS87JO87VAc01kEzKzhxRgfkwIhAMZPoAl4JpHsHsdgYPXln4L4SEEbL/R6DfUdvtXPK4sdAiEAv9V0bxPimVHWUF6R8Ud6fPAzdJ7jP41ishKpjNsmVEMCIQCZt77lmCzNj6mMAjkmYgdzDeF0Fg7mAnYvOg9izGOEQQIgchiD1OLZQCUuETiBiOLJ9NWWVWK5enEK4JhI3fj/teQ=";
exports.authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.query.token;
        let legit = jsonwebtoken_1.default.verify(token, privateKey);
        const user = yield users_1.findUserByPhone(Object.values(legit)[0]);
        if (user) {
            exports.userOnSession = user;
            next();
        }
    }
    catch (error) {
        return res.status(500).send(`Unexpected error: ${error}`);
    }
});
//GET - url: /, ritorna tutti gli utenti.
router.get('/', exports.authorization, [
    express_validator_1.query('name')
        .isString()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (exports.userOnSession) { //verificare il funzionamento di locals
            const phonebook = yield users_1.getPhonebookInfoByPhone(exports.userOnSession.phone);
            res.json(phonebook);
        }
        else {
            const users = yield users_1.getAllUsers(req.query.name);
            res.json(users);
        }
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
        .trim(),
    express_validator_1.body('password')
        .isString()
        .not().isEmpty()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { nickname, name, surname, phone, password } = req.body;
    try {
        const result = yield users_1.addUser(nickname, name, surname, phone, password);
        res.json(result);
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
//POST - url: /add-contact, aggiunge un utente in una rubrica + BODY.
router.post('/add-contact', exports.authorization, [
    express_validator_1.body('phone')
        .isString()
        .not().isEmpty()
        .trim(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.body.phone;
    try {
        const result = yield users_1.addInPhonebookByPhone(exports.userOnSession.phone, phone);
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
//DELETE - url: /:phone, cancella l'utente da una rubrica avendo il numero di telefono.
router.delete('/remove-contact/:phone', exports.authorization, [
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
        const result = yield users_1.removeInPhonebookByPhone(exports.userOnSession.phone, phone);
        res.json(result);
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
router.post('/login', [
    express_validator_1.body('phone')
        .isString()
        .trim(),
    express_validator_1.body('password')
        .isString()
        .trim()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const phone = req.body.phone;
        const password = req.body.password;
        let foundUser = yield users_1.findUserByPhone(phone);
        let user;
        const passwordVerification = yield bcrypt_1.default.compare(password, foundUser.password);
        if (passwordVerification) {
            user = foundUser;
        }
        else {
            return res.status(401).send(`Login credentials aren't valid. Please, try again.`);
        }
        const payload = {
            phone: user.phone,
            password: user.password
        };
        var token = jsonwebtoken_1.default.sign(payload, privateKey);
        return res.status(201).json(token);
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map