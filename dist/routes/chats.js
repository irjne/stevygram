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
const chats_1 = require("../lib/chats");
const users_1 = require("../lib/users");
const router = express_1.default.Router();
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('sto passando dal middleware');
    if (req.query.user) {
        res.locals.user = yield users_1.findUserByPhone(req.query.user);
    }
    next();
});
//GET - url: /, stampa tutte le chat
router.get('/', middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield chats_1.getAllChats(res.locals.user);
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
//- url: /:id/users, stampa tutti gli utenti di una chat;
router.get('/:id/users', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    try {
        const result = yield chats_1.getUsersByChatId(id);
        if (result == false)
            return res.status(404).send("Chat not found.");
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
//- url: /:id, stampa tutti i dati di una chat;
router.get('/:id', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    try {
        const result = yield chats_1.getInfoByChatId(id);
        if (result == false)
            return res.status(404).send(`Chat not found.`);
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// - url: /:id/messages, stampa tutti i messaggi di una chat:
router.get('/:id/messages', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { sender, word } = req.query;
    //filter: ?word="pippo", stampa tutti i messaggi contenenti la parola; 
    if (req.query.word) {
        try {
            const result = yield chats_1.searchByChatId(id, undefined, word);
            if (result == false)
                return res.status(404).send(`Chat not found.`);
            res.json(result);
        }
        catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }
    //filter: ?sender="id", stampa tutti i messaggi di un determinato utente.
    else if (req.query.sender) {
        try {
            const result = yield chats_1.searchByChatId(id, sender);
            if (result == false)
                return res.status(404).send(`Chat not found.`);
            res.json(result);
        }
        catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }
    else {
        try {
            const result = yield chats_1.getMessagesByChatId(id);
            if (result == false)
                return res.status(404).send(`Chat not found.`);
            res.json(result);
        }
        catch (err) {
            return res.status(400).send(`Unexpected error: ${err}`);
        }
    }
}));
//PUT - url: /:id + BODY, modifica una chat dando un id.
router.put('/:id', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.body('description')
        .trim()
        .isString(),
    express_validator_1.body('name')
        .trim()
        .isString(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!req.body.description && !req.body.name)
        return res.status(400).json({ errors: "Name or description are required" });
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { description, name } = req.body;
    try {
        const result = yield chats_1.changeInfoByChatId(id, name, description);
        if (result == false)
            return res.status(404).send(`Chat not found.`);
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
//POST - url: / + BODY, aggiunge una chat.
router.post('/', [
    express_validator_1.param('id')
        .isNumeric()
        .not().isEmpty(),
    express_validator_1.body('description')
        .trim()
        .isString(),
    express_validator_1.body('name')
        .trim()
        .isString()
        .not().isEmpty(),
    express_validator_1.body('users')
        .isString()
        .trim(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { id, name, description, users } = req.body;
    const usersArray = users.split(users, ", ");
    try {
        const result = yield chats_1.addChat(id, name, description, usersArray);
        if (result == false)
            return res.status(404).send(`Chat not found.`);
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
//DELETE - url: /:id, cancella la chat avendo l'id.
router.delete('/:id', [
    express_validator_1.param('id')
        .isNumeric(),
    express_validator_1.sanitizeParam('id').toInt()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const id = req.params.id;
    try {
        const result = yield chats_1.removeChatById(id);
        if (result == false)
            return res.status(404).send(`Chat not found.`);
        res.json(result);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
exports.default = router;
//# sourceMappingURL=chats.js.map