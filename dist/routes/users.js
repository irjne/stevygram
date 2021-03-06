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
const mongoose_1 = __importDefault(require("mongoose"));
// this statement prints plain mongoDB queries on terminal
mongoose_1.default.set('debug', true);
// defining schema and model of users collection
const Schema = mongoose_1.default.Schema;
exports.usersSchema = new Schema({
    name: String,
    surname: String,
    nickname: String,
    phone: String,
    password: String,
    phonebook: [String]
});
exports.usersModel = mongoose_1.default.model("user", exports.usersSchema);
// initializing express router
const router = express_1.default.Router();
// token validation system
const privateKey = "MIIBPAIBAAJBAKcm16uoSgb36jlNsApBQf36uz17EPbkRLWAbW+8oQs2qExo68QBvNQWrriPnmOdYgmJrBJZCw9nbIEne5eRZKcCAwEAAQJBAII/pjdAv86GSKG2g8K57y51vom96A46+b9k/+Hd3q/Y+Mf4VxaXcMk8VkdQbY4zCkQCgmdyB8zAhIoobikU3CECIQDXxsKDIuXbt/V/+s7YyJS87JO87VAc01kEzKzhxRgfkwIhAMZPoAl4JpHsHsdgYPXln4L4SEEbL/R6DfUdvtXPK4sdAiEAv9V0bxPimVHWUF6R8Ud6fPAzdJ7jP41ishKpjNsmVEMCIQCZt77lmCzNj6mMAjkmYgdzDeF0Fg7mAnYvOg9izGOEQQIgchiD1OLZQCUuETiBiOLJ9NWWVWK5enEK4JhI3fj/teQ=";
exports.authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        const payload = jsonwebtoken_1.default.verify(token, privateKey);
        //locally (on server) storing user's phone on for userOnSession
        res.locals.userOnSession = Object.values(payload)[0];
        next();
    }
    catch (error) {
        return res.status(500).send(`Unexpected error: ${error}`);
    }
});
// connection to MongoDB database on cluster
exports.mongoDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const host = "mongodb+srv://matteo:stevygram@cluster0-q7lqh.mongodb.net/stevygram0?retryWrites=true&w=majority";
    // otherwise, use this:
    //const host = "mongodb+srv://matteo:stevygram@fakecluster-ahthz.mongodb.net/stevygram0?retryWrites=true&w=majority";
    mongoose_1.default.connect(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var db = mongoose_1.default.connection;
    db.on('error', function () {
        console.error('Connection error!\n');
    });
    db.once('open', function () {
        console.log('DB	connection ready\n');
    });
});
// it returns all users
router.get('/', [], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.mongoDBConnection();
        if (res.locals.userOnSession) {
            let phonebook = yield exports.usersModel.find({ phone: res.locals.userOnSession }, 'phonebook').exec();
            if (phonebook) {
                res.status(200).json(phonebook);
            }
            else {
                res.status(500).send("Error: id invalid.");
            }
        }
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it returns the users with this phone
router.get('/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim()
], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.mongoDBConnection();
        let phone = req.params.phone;
        exports.usersModel.find({ phone: phone }, (err, user) => {
            if (err) {
                res.send("Error!");
            }
            else {
                res.json(user);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it returns all users with this name
router.get('/:name', [
    express_validator_1.param('name')
        .isString()
        .trim()
], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.mongoDBConnection();
        let name = req.params.name;
        exports.usersModel.find({ name: name }, (err, users) => {
            if (err) {
                res.status(404).send("Error!");
            }
            else {
                res.status(200).json(users);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it modifies the user with this phone. New data are passed by body.
// Body must have at least a not empty field, otherwise it will return error.
// It returns an user before and after modifying operation.
// User before modifying is useful for client forms.
router.put('/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim(),
    express_validator_1.body('nickname')
        .isString(),
    express_validator_1.body('name')
        .isString(),
    express_validator_1.body('surname')
        .isString(),
], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    const { nickname, name, surname } = req.body;
    if (!nickname && !name && !surname) {
        return res.status(400).json({ errors: "Nickname or fullname (name, surname) are required" });
    }
    try {
        exports.mongoDBConnection();
        const filter = { phone: phone };
        // storing original user document
        let originalUser = yield exports.usersModel.find({ phone: phone }).exec();
        if (nickname !== "") {
            // modifyingUser is the found document after updating was applied 
            // because of <<new: true>>
            let user = yield exports.usersModel.findOneAndUpdate(filter, { nickname: nickname }, { new: true });
        }
        if (name !== "") {
            // modifyingUser is the found document after updating was applied 
            // because of <<new: true>>
            const salt = yield bcrypt_1.default.genSalt(5);
            let password = yield bcrypt_1.default.hash(name, salt);
            let user = yield exports.usersModel.findOneAndUpdate(filter, { name: name, password: password }, { new: true });
        }
        if (surname !== "") {
            // modifyingUser is the found document after updating was applied 
            // because of <<new: true>>
            let modifiedUser = yield exports.usersModel.findOneAndUpdate(filter, { surname: surname }, { new: true });
        }
        let modifiedUser = yield exports.usersModel.find({ phone: phone }).exec();
        res.status(200).json({ "user": originalUser, "modifiedUser": modifiedUser });
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
// it adds a new phone to an user's phonebook
router.put('/add-contact/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim(),
    express_validator_1.body('contact')
        .isString()
        .not().isEmpty()
        .trim(),
], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    const contact = req.body.contact;
    try {
        exports.mongoDBConnection();
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new contact will be added to user's phonebook just once. Without 
        // them, it will happen twice and the whole phonebook could be overwritten.
        let user = yield exports.usersModel.findOneAndUpdate({ phone: phone }, { $push: { phonebook: contact } }, { upsert: true, new: true }).exec();
        if (user) {
            res.status(200).json({ "user": user });
        }
        else {
            res.status(500).send("Error!");
        }
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it inserts a new user in database by body
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
    const nickname = req.body.nickname;
    const name = req.body.name;
    const surname = req.body.surname;
    const phone = req.body.phone;
    // password and its hashing
    const salt = yield bcrypt_1.default.genSalt(5);
    let password = yield bcrypt_1.default.hash(req.body.password, salt);
    try {
        exports.mongoDBConnection();
        let user = new exports.usersModel({ nickname, name, surname, phone, password });
        user.save(err => {
            if (err)
                return res.status(500).send(err);
            return res.status(200).json(user);
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it returns a verbose message and a jwt token
router.post('/login', [
    express_validator_1.body('phone')
        .isString()
        .not().isEmpty()
        .trim(),
    express_validator_1.body('password')
        .isString()
        .not().isEmpty()
        .trim(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        exports.mongoDBConnection();
        const phone = req.body.phone;
        const password = req.body.password;
        let user = yield exports.usersModel.findOne({ phone: phone }).exec();
        if (!user) {
            return res.status(400).send({ message: "This username does not exist." });
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            return res.status(400).send({ message: "The password is not valid." });
        }
        const token = jsonwebtoken_1.default.sign({ phone: phone, password: password }, privateKey, { expiresIn: '5h' });
        res.send({
            message: "The username and password combination is correct!",
            token: token
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it deletes the user with this phone
router.delete('/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim()
], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let phone = req.params.phone;
    try {
        exports.mongoDBConnection();
        let user = yield exports.usersModel.findOneAndRemove({ phone: phone }, (err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            const response = {
                message: `User successfully deleted!`,
                user: user
            };
            return res.status(200).json(response);
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it deletes a contanct from an user's phonebook
router.delete('/remove-contact/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim()
], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    if (res.locals.userOnSession) {
        try {
            exports.mongoDBConnection();
            // just like post(/add-contact/:phone) case, but we use $pull operator
            // because we are removing an element from an array.
            let user = yield exports.usersModel.findOneAndUpdate({ phone: res.locals.userOnSession }, { $pull: { phonebook: phone } }, { upsert: true, new: true }).exec();
            if (user) {
                res.status(200).json({ message: "contact deleted successfully", updatedUser: user });
            }
            else {
                res.status(500).send("Error: contact not found.");
            }
        }
        catch (err) {
            return res.status(500).send(`Unexpected error: ${err}`);
        }
    }
}));
// hashes all user names and returns the former users collection
router.patch("/hashNames", (q, s, n) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.mongoDBConnection();
        let users = yield exports.usersModel.find((err, users) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return s.status(500).send(err);
            const salt = yield bcrypt_1.default.genSalt(5);
            for (let index = 0; index < users.length; index++) {
                const name = users[index].name;
                const phone = users[index].phone;
                let password = yield bcrypt_1.default.hash(name, salt);
                let user = yield exports.usersModel.findOneAndUpdate({ phone: phone }, { password: password }).exec();
            }
            s.status(200).send(users);
        }));
    }
    catch (error) {
        s.status(500).send(error);
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map