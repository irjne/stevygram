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
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("../lib/users");
// this statement prints plain mongoDB queries on terminal
mongoose_1.default.set('debug', true);
// defining users collection schema and model
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
router.get('/', [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    express_validator_1.param('phone')
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
        .trim()
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
router.put('/add-contact/:userPhone', [
    express_validator_1.param('userPhone')
        .isString()
        .trim(),
    express_validator_1.body('newPhone')
        .isString()
        .not().isEmpty()
        .trim(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userPhone = req.params.userPhone;
    const newPhone = req.body.newPhone;
    try {
        exports.usersMongoDBConnection();
        const filter = { phone: userPhone };
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new contact will be added to user's phonebook just once. 
        // Without them, it will happen twice.
        let doc = yield usersModel.findOneAndUpdate(filter, { $push: { phonebook: newPhone } }, { upsert: true, new: true }, (err, user) => {
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
    const { nickname, name, surname, phone } = req.body;
    console.log("I'm here");
    try {
        exports.usersMongoDBConnection();
        let addingUser = new usersModel(req.body);
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
        yield usersModel.findOneAndRemove({ phone: phone }, (err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            const response = {
                message: "Todo successfully deleted",
                userDeleted: user
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
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new contact will be added to user's phonebook just once. 
        // Without them, it will happen twice.
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
router.get("/test", (q, s, n) => {
    //Using MongoClient
    /*
    MongoClient.connect(host, function (err: any, db: any) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection("users").find().toArray(function (err: any, result: any) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
    */
});
exports.default = router;
//# sourceMappingURL=mongooseUsers.js.map