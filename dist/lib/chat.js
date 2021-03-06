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
const user_1 = require("./user");
const fs = __importStar(require("fs"));
exports.directory = __dirname.replace("/lib", "/data");
exports.addChat = (id, name, description, users) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        obj.chats.push({ id, name, description, users });
        let json = JSON.stringify(obj);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/chats.json', json, 'utf-8');
        return `Chat \"${name}\" added successfully.`;
    }
    catch (err) {
        return err;
    }
});
exports.getAllChats = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        let chats = JSON.parse(yield readFile(exports.directory + '/chats.json', 'utf-8')).chats;
        if (user) {
            chats = chats.filter(chat => {
                return chat.users.includes(user.phone);
            });
            chats = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
                if (chat.users.length === 2) {
                    const otherUserPhone = user.phone === chat.users[0] ? chat.users[1] : chat.users[0];
                    const otherUser = yield user_1.findUserByPhone(otherUserPhone);
                    chat.name = `${otherUser.name} ${otherUser.surname}`;
                }
                return chat;
            })));
        }
        return Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            const lastMessage = chat.messages.pop();
            delete chat.users;
            delete chat.messages;
            chat.lastMessage = lastMessage;
            chat.lastMessage.sender = yield user_1.findUserByPhone(chat.lastMessage.sender);
            return chat;
        })));
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
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        return { users: obj.chats[id].users };
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
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        //return [obj.chats[id].name, obj.chats[id].description];
        return { name: obj.chats[id].name, description: obj.chats[id].description, users: obj.chats[id].users, messages: obj.chats[id].messages };
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
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
        obj = JSON.parse(chats);
        if (id > obj.chats.length - 1)
            return false;
        return { messages: obj.chats[id].messages };
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
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
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
            yield writeFile(exports.directory + '/chats.json', json, 'utf-8');
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
exports.searchByChatId = (id, sender, word) => __awaiter(void 0, void 0, void 0, function* () {
    let obj = {
        chats: Array()
    };
    let choice = -1;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
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
        const chats = yield readFile(exports.directory + '/chats.json', 'utf-8');
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
        yield writeFile(exports.directory + '/chats.json', json, 'utf-8');
        return `Chat \"${id}\" removed successfully.`;
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=chat.js.map