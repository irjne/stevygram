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
const usersSchema = new Schema({
    //_id: mongoose.Types.ObjectId,
    name: String,
    surname: String,
    nickname: String,
    phone: String,
    password: String,
    phonebook: [String]
});
let usersModel = mongoose_1.default.model("user", usersSchema);
// initializing express router
const router = express_1.default.Router();
const privateKey = "MIIBPAIBAAJBAKcm16uoSgb36jlNsApBQf36uz17EPbkRLWAbW+8oQs2qExo68QBvNQWrriPnmOdYgmJrBJZCw9nbIEne5eRZKcCAwEAAQJBAII/pjdAv86GSKG2g8K57y51vom96A46+b9k/+Hd3q/Y+Mf4VxaXcMk8VkdQbY4zCkQCgmdyB8zAhIoobikU3CECIQDXxsKDIuXbt/V/+s7YyJS87JO87VAc01kEzKzhxRgfkwIhAMZPoAl4JpHsHsdgYPXln4L4SEEbL/R6DfUdvtXPK4sdAiEAv9V0bxPimVHWUF6R8Ud6fPAzdJ7jP41ishKpjNsmVEMCIQCZt77lmCzNj6mMAjkmYgdzDeF0Fg7mAnYvOg9izGOEQQIgchiD1OLZQCUuETiBiOLJ9NWWVWK5enEK4JhI3fj/teQ=";
exports.authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        const payload = yield jsonwebtoken_1.default.verify(token, privateKey);
        //console.log(payload);
        //return res.status(200).send(payload);
        res.locals.userOnSession = Object.values(payload)[0];
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(`Unexpected error: ${error}`);
    }
});
// connection to MongoDB database on cluster
exports.usersMongoDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const host = "mongodb+srv://matteo:stevygram@cluster0-q7lqh.mongodb.net/stevygram0?retryWrites=true&w=majority";
    mongoose_1.default.connect(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var db = mongoose_1.default.connection;
    db.on('error', function () {
        console.error('Connection	error!\n');
    });
    db.once('open', function () {
        console.log('DB	connection	Ready\n');
        //console.log(mongoose.connection.db.collections()); // [{ name: 'dbname.myCollection' }]
    });
});
// it returns all users
router.get('/', [], exports.authorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.usersMongoDBConnection();
        usersModel.find((err, users) => {
            if (err) {
                res.send("Error!");
            }
            else {
                res.send(users);
            }
        });
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.usersMongoDBConnection();
        let phone = req.params.phone;
        usersModel.find({ phone: phone }, (err, users) => {
            if (err) {
                res.send("Error!");
            }
            else {
                res.send(users);
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.usersMongoDBConnection();
        let name = req.params.name;
        usersModel.find({ name: name }, (err, users) => {
            if (err) {
                res.send("Error!");
            }
            else {
                res.send(users);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it modifies the user with this phone. You pass new values by body
router.put('/:phone', [
    express_validator_1.param('phone')
        .isString()
        .trim(),
    express_validator_1.body('nickname')
        .isString()
        .trim(),
    express_validator_1.body('name')
        .isString()
        .trim(),
    express_validator_1.body('surname')
        .isString()
        .trim(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone; // param
    const { nickname, name, surname } = req.body; // body
    if (!nickname && !name && !surname) {
        return res.status(400).json({ errors: "Nickname or fullname (name, surname) are required" });
    }
    try {
        exports.usersMongoDBConnection();
        const filter = { phone: phone };
        const update = {
            nickname: nickname,
            name: name,
            surname: surname
        };
        // doc is the found document after updating was applied because of <<new: true>>
        let doc = yield usersModel.findOneAndUpdate(filter, update, {
            new: true
        });
        res.send(doc);
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.user;
    const contact = req.body.contact;
    try {
        exports.usersMongoDBConnection();
        const filter = { phone: phone };
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new contact will be added to user's phonebook just once. Without 
        // them, it will happen twice and the whole phonebook could be overwritten.
        let doc = yield usersModel.findOneAndUpdate(filter, { $push: { phonebook: contact } }, { upsert: true, new: true }, (err, user) => {
            if (err) {
                res.status(500).json({ "error": err });
            }
            else {
                res.status(200).json({ "addingContactLog": user });
            }
        });
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
    let password = yield bcrypt_1.default.hash(name, salt);
    try {
        exports.usersMongoDBConnection();
        let addingUser = new usersModel({ nickname, name, surname, phone, password });
        addingUser.save(err => {
            if (err)
                return res.status(500).send(err);
            return res.status(200).send(addingUser);
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
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        exports.usersMongoDBConnection();
        const phone = req.body.phone;
        const password = req.body.password;
        let user = yield usersModel.findOne({ phone: phone }).exec();
        if (!user) {
            return res.status(400).send({ message: "This username does not exist." });
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            return res.status(400).send({ message: "The password is not valid." });
        }
        const token = jsonwebtoken_1.default.sign({ phone: phone, password: password }, privateKey, { expiresIn: '5h' });
        //authorization(token);
        res.send({
            message: "The username and password combination is correct!",
            //user: user,
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let phone = req.params.phone;
    try {
        exports.usersMongoDBConnection();
        let user = yield usersModel.findOneAndRemove({ phone: phone }, (err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            const response = {
                message: `User successfully deleted!`,
                user: user
            };
            return res.status(200).send(response);
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
// it deletes a contanct from an user's phonebook
router.delete('/remove-contact/:userPhone', [
    express_validator_1.param('userPhone')
        .isString()
        .trim(),
    express_validator_1.body('contactPhone')
        .isString()
        .not().isEmpty()
        .trim(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userPhone = req.params.userPhone;
    const contactPhone = req.body.contactPhone;
    try {
        exports.usersMongoDBConnection();
        const filter = { phone: userPhone };
        // just like post(/add-contact/:phone) case, but we use $pull operator
        // because we are removing an element from an array.
        let doc = yield usersModel.findOneAndUpdate(filter, { $pull: { phonebook: contactPhone } }, { upsert: true, new: true }, (err, user) => {
            if (err) {
                res.status(500).json({ "error": err });
            }
            else {
                res.status(200).json({ "removingContactLog": user });
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
}));
exports.default = router;
//# sourceMappingURL=mongooseUsers.js.map