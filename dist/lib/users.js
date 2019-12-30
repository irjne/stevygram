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
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs = __importStar(require("fs"));
exports.directory = __dirname.replace("/lib", "/data");
exports.addUser = (nickname, name, surname, phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (phone == users[i].phone) {
                return `User ${phone} already exists.`;
            }
        }
        let phonebook = new Array();
        users.push({ nickname, name, surname, phone, phonebook });
        let json = JSON.stringify(users);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
        return `User ${nickname} added successfully.`;
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
exports.addInPhonebookByPhone = (findByPhone, usersToAdd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const usersByFile = yield readFile(exports.directory + '/users.json', 'utf-8');
        const users = JSON.parse(usersByFile).users;
        for (let i = 0; i < users.length; i++) {
            if (findByPhone == users[i].phone) {
                for (let j = 0; j < usersToAdd.length; j++) {
                    users[i].phonebook.push(usersToAdd[j]);
                }
            }
        }
        let json = JSON.stringify(users);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
        return `User ${findByPhone}'s phonebook was successfully updated.`;
    }
    catch (err) {
        return err;
    }
});
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
        let json = JSON.stringify(users);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/users.json', json, 'utf-8');
        return `User ${phone} removed successfully.`;
    }
    catch (err) {
        return err;
    }
});
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