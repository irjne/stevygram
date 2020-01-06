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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs = __importStar(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.directory = __dirname.replace("/lib", "/data");
//? creates a new user in stevygram environment 
exports.addUser = (nickname, name, surname, phone, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                return `User ${phone} already exists.`;
            }
        }
        // hashing and salting password
        const salt = yield bcrypt_1.default.genSalt(5);
        let hashedPassword = yield bcrypt_1.default.hash(password, salt);
        let phonebook = new Array();
        users.push({ nickname, name, surname, phone, phonebook, password: hashedPassword });
        let json = JSON.stringify({ "users": users });
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
        return `User ${nickname} added successfully.`;
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
//? generates users passwords and store them in users data JSON
const generateHashedPassword = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            const salt = yield bcrypt_1.default.genSalt(5);
            users[i].password = yield bcrypt_1.default.hash(users[i].name, salt);
        }
        let json = JSON.stringify({ "users": users });
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
    }
    catch (err) {
        return err;
    }
});
//? creates an existing user in a phonebook 
exports.addInPhonebookByPhone = (phone, userToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                users[i].phonebook.push(userToAdd);
            }
        }
        let json = JSON.stringify({ "users": users });
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
        return `User ${phone}'s phonebook was successfully updated.`;
    }
    catch (err) {
        return err;
    }
});
//? returns all users of stevygram or specific users (by name)
exports.getAllUsers = (findByName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        if (!findByName)
            return users;
        return users.filter((user) => {
            return user.name === findByName;
        });
    }
    catch (err) {
        return err;
    }
});
//? returns all contacts of a specific phonebook
exports.getPhonebookInfoByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        let phonebook = [];
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                phonebook = users[i].phonebook;
            }
        }
        let phonebookInfo = [];
        for (let i = 0; i < phonebook.length; i++) {
            phonebookInfo.push(users.find((user) => phonebook[i] === user.phone));
        }
        return phonebookInfo;
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
//? modifies a specif user info (by phone)
exports.changeUserByPhone = (phone, nickname, name, surname) => __awaiter(void 0, void 0, void 0, function* () {
    let isFounded = false;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                if (nickname)
                    users[i].nickname = nickname;
                if (name)
                    users[i].name = name;
                if (surname)
                    users[i].surname = surname;
                isFounded = true;
                break;
            }
        }
        if (isFounded) {
            let json = JSON.stringify(users);
            const writeFile = util_1.promisify(fs.writeFile);
            yield writeFile(exports.directory + '/users.json', json, 'utf-8');
            return `User ${nickname} (${phone}) changed successfully.`;
        }
        else {
            return `User \"${phone}\" not found.`;
        }
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
//? deletes a specific user (by phone)
exports.removeUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                users.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify({ "users": users });
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
        return `User ${phone} removed successfully.`;
    }
    catch (err) {
        return err;
    }
});
//? returns a specific user (by phone)
exports.findUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const users = JSON.parse(yield readFile(exports.directory + '/users.json', 'utf-8')).users;
        return users.find((user) => user.phone === phone);
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=users.js.map