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
exports.addUser = (nickname, name, surname, phone) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        users: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const users = yield readFile(__dirname + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        let exists = false;
        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                return `User ${phone} already exists.`;
            }
        }
        obj.users.push({ nickname, name, surname, phone });
        let json = JSON.stringify(obj);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(__dirname + '/users.json', json, 'utf-8');
        return `User ${nickname} added successfully.`;
    }
    catch (err) {
        console.error(err);
        return err;
    }
});
exports.addChat = (id, name, description, users) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        obj.chats.push({ id, name, description, users });
        let json = JSON.stringify(obj);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(__dirname + '/chats.json', json, 'utf-8');
        return `Chat \"${name}\" added successfully.`;
    }
    catch (err) {
        return err;
    }
});
exports.getAllChats = () => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        return obj;
    }
    catch (err) {
        return err;
    }
});
exports.getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        users: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const users = yield readFile(__dirname + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        return obj.users;
    }
    catch (err) {
        return err;
    }
});
exports.getUsersByChatId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        return obj.chats[id].users;
    }
    catch (err) {
        return err;
    }
});
exports.getInfoByChatId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        return [obj.chats[id].name, obj.chats[id].description];
    }
    catch (err) {
        return err;
    }
});
exports.getMessagesByChatId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        console.log(obj.chats[id].messages);
        if (id > obj.chats.length - 1)
            return false;
        return obj.chats[id].messages;
    }
    catch (err) {
        return err;
    }
});
exports.changeInfoByChatId = (id, name, description) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    let isFounded = false;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        for (let i = 0; i < obj.chats.length; i++) {
            if (id == obj.chats[i].id) {
                if (name)
                    obj.chats[i].name = name;
                if (description)
                    obj.chats[i].description = description;
                isFounded = true;
                break;
            }
        }
        if (isFounded) {
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            yield writeFile(__dirname + '/chats.json', json, 'utf-8');
            return `Chat ${name} changed successfully.`;
        }
        else {
            return `Chat ${name} not found.`;
        }
    }
    catch (err) {
        return err;
    }
});
exports.changeUserByPhone = (phone, nickname, name, surname) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        users: Array()
    };
    let isFounded = false;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const users = yield readFile(__dirname + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                if (nickname)
                    obj.users[i].nickname = nickname;
                if (name)
                    obj.users[i].name = name;
                if (surname)
                    obj.users[i].surname = surname;
                isFounded = true;
            }
        }
        if (isFounded) {
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            yield writeFile(__dirname + '/users.json', json, 'utf-8');
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
exports.searchByChatId = (id, sender, word) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    let choice = -1;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        if (sender)
            choice = 0;
        else if (word)
            choice = 1;
        let isFounded = false;
        let result = {
            messages: Array()
        };
        switch (choice) {
            case 0:
                // search by sender
                for (let i = 0; i < obj.chats.length; i++) {
                    if (id == obj.chats[i].id) {
                        for (let j = 0; j < obj.chats[i].messages.length; j++) {
                            if (sender == obj.chats[i].messages[j].sender) {
                                result.messages[result.messages.length] = {
                                    "body": obj.chats[i].messages[j].body,
                                    "date": obj.chats[i].messages[j].date
                                };
                                isFounded = true;
                            }
                        }
                    }
                }
                break;
            case 1:
                // search by word
                for (let i = 0; i < obj.chats.length; i++) {
                    if (id == obj.chats[i].id) {
                        for (let j = 0; j < obj.chats[i].messages.length; j++) {
                            if (obj.chats[i].messages[j].body.includes(word)) {
                                result.messages[result.messages.length] = {
                                    "sender": obj.chats[i].messages[j].sender,
                                    "body": obj.chats[i].messages[j].body,
                                    "date": obj.chats[i].messages[j].date
                                };
                                isFounded = true;
                            }
                        }
                    }
                }
                break;
        }
        if (isFounded) {
            return result;
        }
        else {
            if (choice == 0)
                return `The research by user (${sender}) reported 0 results.`;
            else
                return `The research by word (${word}) reported 0 results.`;
        }
    }
    catch (err) {
        return err;
    }
});
exports.removeChatById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(__dirname + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        for (let i = 0; i < obj.chats.length; i++) {
            if (id == obj.chats[i].id) {
                obj.chats.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(__dirname + '/chats.json', json, 'utf-8');
        return `Chat \"${id}\" removed successfully.`;
    }
    catch (err) {
        return err;
    }
});
exports.removeUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        users: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const users = yield readFile(__dirname + '/users.json', 'utf-8');
        obj = JSON.parse(users);
        for (let i = 0; i < obj.users.length; i++) {
            if (phone == obj.users[i].phone) {
                obj.users.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(obj);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(__dirname + '/users.json', json, 'utf-8');
        return `User ${phone} removed successfully.`;
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=index.js.map