import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../lib/users';

// this statement prints plain mongoDB queries on terminal
mongoose.set('debug', true);

// defining schema and model of users collection
const Schema = mongoose.Schema;
export const usersSchema = new Schema({
    name: String,
    surname: String,
    nickname: String,
    phone: String,
    password: String,
    phonebook: [String]
});
export const usersModel = mongoose.model<User>("user", usersSchema);

// initializing express router
const router = express.Router();

// token validation system
const privateKey = "MIIBPAIBAAJBAKcm16uoSgb36jlNsApBQf36uz17EPbkRLWAbW+8oQs2qExo68QBvNQWrriPnmOdYgmJrBJZCw9nbIEne5eRZKcCAwEAAQJBAII/pjdAv86GSKG2g8K57y51vom96A46+b9k/+Hd3q/Y+Mf4VxaXcMk8VkdQbY4zCkQCgmdyB8zAhIoobikU3CECIQDXxsKDIuXbt/V/+s7YyJS87JO87VAc01kEzKzhxRgfkwIhAMZPoAl4JpHsHsdgYPXln4L4SEEbL/R6DfUdvtXPK4sdAiEAv9V0bxPimVHWUF6R8Ud6fPAzdJ7jP41ishKpjNsmVEMCIQCZt77lmCzNj6mMAjkmYgdzDeF0Fg7mAnYvOg9izGOEQQIgchiD1OLZQCUuETiBiOLJ9NWWVWK5enEK4JhI3fj/teQ=";
export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.query.token;
        const payload = jwt.verify(token, privateKey);
        //locally (on server) storing user's phone on for userOnSession
        res.locals.userOnSession = Object.values(payload)[0];
        next();
    } catch (error) {
        return res.status(500).send(`Unexpected error: ${error}`);
    }
};

// connection to MongoDB database on cluster
export const mongoDBConnection = async () => {
    //const host = "mongodb+srv://matteo:stevygram@cluster0-q7lqh.mongodb.net/stevygram0?retryWrites=true&w=majority";
    // otherwise, use this:
    const host = "mongodb+srv://matteo:stevygram@fakecluster-ahthz.mongodb.net/stevygram0?retryWrites=true&w=majority";
    mongoose.connect(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var db = mongoose.connection;
    db.on('error', function () {
        console.error('Connection error!\n');
    });
    db.once('open', function () {
        console.log('DB	connection ready\n');
    });
};

// it returns all users
router.get('/', [
], authorization, async (req: Request, res: Response) => {
    try {
        mongoDBConnection();
        if (res.locals.userOnSession) {
            let phonebook = await usersModel.find({ phone: res.locals.userOnSession }, 'phonebook').exec();
            if (phonebook) {
                res.status(200).json(phonebook);
            } else {
                res.status(500).send("Error: id invalid.");
            }
        }
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it returns the users with this phone
router.get('/:phone', [
    param('phone')
        .isString()
        .trim()
], authorization, async (req: Request, res: Response) => {
    try {
        mongoDBConnection();
        let phone = req.params.phone;
        usersModel.find({ phone: phone }, (err: any, user: User[]) => {
            if (err) {
                res.send("Error!");
            } else {
                res.json(user);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it returns all users with this name
router.get('/:name', [
    param('name')
        .isString()
        .trim()
], authorization, async (req: Request, res: Response) => {
    try {
        mongoDBConnection();
        let name = req.params.name;
        usersModel.find({ name: name }, (err: any, users: any) => {
            if (err) {
                res.status(404).send("Error!");
            } else {
                res.status(200).json(users);
            }
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it modifies the user with this phone. New data are passed by body.
// Body must have at least a not empty field, otherwise it will return error.
// It returns an user before and after modifying operation.
// User before modifying is useful for client forms.
router.put('/:phone', [
    param('phone')
        .isString()
        .trim(),
    body('nickname')
        .isString(),
    body('name')
        .isString(),
    body('surname')
        .isString(),
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    const { nickname, name, surname } = req.body;
    if (!nickname && !name && !surname) {
        return res.status(400).json({ errors: "Nickname or fullname (name, surname) are required" });
    }
    try {
        mongoDBConnection();
        const filter = { phone: phone };
        // storing original user document
        let originalUser = await usersModel.find({ phone: phone }).exec();
        if (nickname !== "") {
            // modifyingUser is the found document after updating was applied 
            // because of <<new: true>>
            let user = await usersModel.findOneAndUpdate(filter,
                { nickname: nickname }, { new: true });
        }
        if (name !== "") {
            // modifyingUser is the found document after updating was applied 
            // because of <<new: true>>
            const salt = await bcrypt.genSalt(5);
            let password = await bcrypt.hash(name, salt);
            let user = await usersModel.findOneAndUpdate(filter,
                { name: name, password: password }, { new: true });
        }
        if (surname !== "") {
            // modifyingUser is the found document after updating was applied 
            // because of <<new: true>>
            let modifiedUser = await usersModel.findOneAndUpdate(filter,
                { surname: surname }, { new: true });
        }
        let modifiedUser = await usersModel.find({ phone: phone }).exec();
        res.status(200).json({ "user": originalUser, "modifiedUser": modifiedUser });
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
});

// it adds a new phone to an user's phonebook
router.put('/add-contact/:phone', [
    param('phone')
        .isString()
        .trim(),
    body('contact')
        .isString()
        .not().isEmpty()
        .trim(),
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    const contact = req.body.contact;
    try {
        mongoDBConnection();
        // { upsert: true, new: true } are two optional settings. They make sure 
        // a new contact will be added to user's phonebook just once. Without 
        // them, it will happen twice and the whole phonebook could be overwritten.
        let user = await usersModel.findOneAndUpdate({ phone: phone },
            { $push: { phonebook: contact } }, { upsert: true, new: true }).exec();
        if (user) {
            res.status(200).json({ "user": user });
        }
        else {
            res.status(500).send("Error!");
        }
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it inserts a new user in database by body
router.post('/', [
    body('nickname')
        .isString()
        .not().isEmpty()
        .trim(),
    body('name')
        .isString()
        .not().isEmpty()
        .trim(),
    body('surname')
        .isString()
        .not().isEmpty()
        .trim(),
    body('phone')
        .isString()
        .not().isEmpty()
        .trim(),
    body('password')
        .isString()
        .not().isEmpty()
        .trim()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const nickname = req.body.nickname;
    const name = req.body.name;
    const surname = req.body.surname;
    const phone = req.body.phone;
    // password and its hashing
    const salt = await bcrypt.genSalt(5);
    let password = await bcrypt.hash(req.body.password, salt);
    try {
        mongoDBConnection();
        let user = new usersModel({ nickname, name, surname, phone, password });
        user.save(err => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(user);
        });
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it returns a verbose message and a jwt token
router.post('/login', [
    body('phone')
        .isString()
        .not().isEmpty()
        .trim(),
    body('password')
        .isString()
        .not().isEmpty()
        .trim(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        mongoDBConnection();
        const phone = req.body.phone;
        const password = req.body.password;
        let user = await usersModel.findOne({ phone: phone }).exec();
        if (!user) {
            return res.status(400).send({ message: "This username does not exist." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).send({ message: "The password is not valid." });
        }
        const token = jwt.sign(
            { phone: phone, password: password },
            privateKey,
            { expiresIn: '5h' });
        res.send({
            message: "The username and password combination is correct!",
            token: token
        });
    }
    catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it deletes the user with this phone
router.delete('/:phone', [
    param('phone')
        .isString()
        .trim()
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let phone = req.params.phone;
    try {
        mongoDBConnection();
        let user = await usersModel.findOneAndRemove({ phone: phone },
            (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
                const response = {
                    message: `User successfully deleted!`,
                    user: user
                };
                return res.status(200).json(response);
            });
    } catch (err) {
        return res.status(500).send(`Unexpected error: ${err}`);
    }
});

// it deletes a contanct from an user's phonebook
router.delete('/remove-contact/:phone', [
    param('phone')
        .isString()
        .trim()
], authorization, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const phone = req.params.phone;
    if (res.locals.userOnSession) {
        try {
            mongoDBConnection();
            // just like post(/add-contact/:phone) case, but we use $pull operator
            // because we are removing an element from an array.
            let user = await usersModel.findOneAndUpdate({ phone: res.locals.userOnSession },
                { $pull: { phonebook: phone } }, { upsert: true, new: true }).exec();
            if (user) {
                res.status(200).json({ message: "contact deleted successfully", updatedUser: user });
            } else {
                res.status(500).send("Error: contact not found.");
            }
        } catch (err) {
            return res.status(500).send(`Unexpected error: ${err}`);
        }
    }
});

// hashes all user names and returns the former users collection
router.patch("/hashNames", async (q, s, n) => {
    try {
        mongoDBConnection();
        let users: any = await usersModel.find(async (err, users) => {
            if (err) return s.status(500).send(err);
            const salt = await bcrypt.genSalt(5);
            for (let index = 0; index < users.length; index++) {
                const name = users[index].name;
                const phone = users[index].phone;
                let password = await bcrypt.hash(name, salt);
                let user = await usersModel.findOneAndUpdate({ phone: phone }, { password: password }).exec();
            }
            s.status(200).send(users);
        });
    } catch (error) {
        s.status(500).send(error);
    }
});

export default router;