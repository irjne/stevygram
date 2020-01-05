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
const users_1 = require("./users");
const fs = __importStar(require("fs"));
exports.directory = __dirname.replace("/lib", "/data");
exports.addChat = (id, name, description, users) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;
        chats.push({ id, name, description, users });
        let json = JSON.stringify(chats);
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
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        let chats = JSON.parse(chatsByFile).chats;
        if (user) {
            chats = chats.filter(chat => {
                return chat.users.includes(user.phone);
            });
            chats = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
                if (chat.users.length === 2) {
                    const otherUserPhone = user.phone === chat.users[0] ? chat.users[1] : chat.users[0];
                    const otherUser = yield users_1.findUserByPhone(otherUserPhone);
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
            chat.lastMessage.sender = yield users_1.findUserByPhone(chat.lastMessage.sender);
            return chat;
        })));
    }
    catch (err) {
        return err;
    }
});
exports.getUsersByChatId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;
        if (id > chats.length - 1)
            return false;
        return { users: chats[id].users };
    }
    catch (err) {
        return err;
    }
});
exports.getInfoByChatId = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;
        if (id > chats.length - 1)
            return false;
        const chat = chats[id];
        let chatName;
        if (user) {
            let contacts = [];
            for (let i = 0; i < chat.users.length; i++) {
                let contact = chat.users[i];
                let contactInfo = yield users_1.findUserByPhone(contact);
                if (contact != user.phone && user.phonebook.includes(contact)) {
                    contacts.push(" " + contactInfo.name + " " + contactInfo.surname);
                }
                else if (contact != user.phone)
                    contacts.push(" " + contactInfo.nickname);
            }
            let messages = [];
            for (let i = 0; i < chat.messages.length; i++) {
                let message = chat.messages[i];
                let sender = yield users_1.findUserByPhone(message.sender);
                if (sender.phone != user.phone && user.phonebook.includes(sender.phone)) {
                    messages.push({ sender: sender.name + " " + sender.surname, body: message.body, date: message.date });
                }
                else if (sender.phone != user.phone)
                    messages.push({ sender: sender.nickname, body: message.body, date: message.date });
                else
                    messages.push({ sender: "Me", body: message.body, date: message.date });
            }
            if (chat.users.length === 2) {
                const otherUserPhone = user.phone === chat.users[0] ? chat.users[1] : chat.users[0];
                const otherUser = yield users_1.findUserByPhone(otherUserPhone);
                chatName = `${otherUser.name} ${otherUser.surname}`;
                return { name: chatName, description: chat.description, users: contacts, messages: messages };
            }
            else
                return { name: chat.name, description: chat.description, users: contacts, messages: messages };
        }
        else
            return { name: chat.name, description: chat.description, users: chat.users, messages: chat.messages };
    }
    catch (err) {
        return err;
    }
});
exports.getMessagesByChatId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;
        if (id > chats.length - 1)
            return false;
        return { messages: chats[id].messages };
    }
    catch (err) {
        return err;
    }
});
exports.changeInfoByChatId = (id, name, description) => __awaiter(void 0, void 0, void 0, function* () {
    let isFounded = false;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile);
        if (id > chats.length - 1)
            return false;
        for (let i = 0; i < chats.length; i++) {
            if (id == chats[i].id) {
                if (name)
                    chats[i].name = name;
                if (description)
                    chats[i].description = description;
                isFounded = true;
                break;
            }
        }
        if (isFounded) {
            let json = JSON.stringify(chats);
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
    let choice = -1;
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile);
        if (id > chats.length - 1)
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
                for (let i = 0; i < chats.length; i++) {
                    if (id == chats[i].id) {
                        for (let j = 0; j < chats[i].messages.length; j++) {
                            if (sender == chats[i].messages[j].sender) {
                                result.messages[result.messages.length] = {
                                    "body": chats[i].messages[j].body,
                                    "date": chats[i].messages[j].date
                                };
                                isFounded = true;
                            }
                        }
                    }
                }
                break;
            case 1:
                // search by word
                for (let i = 0; i < chats.length; i++) {
                    if (id == chats[i].id) {
                        for (let j = 0; j < chats[i].messages.length; j++) {
                            if (chats[i].messages[j].body.includes(word)) {
                                result.messages[result.messages.length] = {
                                    "sender": chats[i].messages[j].sender,
                                    "body": chats[i].messages[j].body,
                                    "date": chats[i].messages[j].date
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
    try {
        const readFile = util_1.promisify(fs.readFile);
        const chatsByFile = yield readFile(exports.directory + '/chats.json', 'utf-8');
        const chats = JSON.parse(chatsByFile).chats;
        if (id > chats.length - 1)
            return false;
        for (let i = 0; i < chats.length; i++) {
            if (id == chats[i].id) {
                chats.splice(i, 1);
                break;
            }
        }
        let json = JSON.stringify(chats);
        const writeFile = util_1.promisify(fs.writeFile);
        yield writeFile(exports.directory + '/chats.json', json, 'utf-8');
        return `Chat \"${id}\" removed successfully.`;
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=chats.js.map