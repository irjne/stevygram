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
exports.addUser = (nickname, name, surname, phone) => {
    let obj = {
        users: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const users = yield readFile('users.json', 'utf-8');
            obj = JSON.parse(users);
            obj.users.push({ nickname, name, surname, phone });
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            const file = yield writeFile('users.json', json, 'utf-8');
            return `User ${nickname} added successfully.`;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }))();
};
exports.addChat = (name, description, users) => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            obj.chats.push({ name, description });
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            const file = yield writeFile('chats.json', json, 'utf-8');
            return `Chat ${name} added successfully.`;
        }
        catch (err) {
            return err;
        }
    }))();
};
exports.getAllChats = () => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            return obj.chats;
        }
        catch (err) {
            return err;
        }
    }));
};
exports.getAllUsers = () => {
    let obj = {
        users: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const users = yield readFile('users.json', 'utf-8');
            obj = JSON.parse(users);
            return obj.users;
        }
        catch (err) {
            return err;
        }
    }));
};
exports.getUsersByChatId = (id) => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            return obj.chats[id].users;
        }
        catch (err) {
            return err;
        }
    }))();
};
exports.getInfoByChatId = (id) => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            return [obj.chats[id].name, obj.chats[id].description];
        }
        catch (err) {
            return err;
        }
    }))();
};
exports.getMessagesByChatId = (id) => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            return obj.chats[id].messages;
        }
        catch (err) {
            return err;
        }
    }))();
};
exports.changeInfoByChatId = (id, name, description) => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            for (let i = 0; i < chats.length; i++) {
                if (id == obj.chats[i].id) {
                    if (name)
                        obj.chats[i].name = name;
                    if (description)
                        obj.chats[i].description = description;
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            const file = yield writeFile('chats.json', json, 'utf-8');
            return `Chat ${name} changed successfully.`;
        }
        catch (err) {
            return err;
        }
    }))();
};
exports.changeUserByPhone = (phone, nickname, name, surname) => {
    let obj = {
        users: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('users.json', 'utf-8');
            obj = JSON.parse(chats);
            for (let i = 0; i < chats.length; i++) {
                if (phone == obj.users[i].phone) {
                    if (nickname)
                        obj.users[i].nickname = nickname;
                    if (name)
                        obj.users[i].name = name;
                    if (surname)
                        obj.users[i].surname = surname;
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            const file = yield writeFile('users.json', json, 'utf-8');
            return `User ${nickname} (${phone}) changed successfully.`;
        }
        catch (err) {
            return err;
        }
    }))();
};
exports.removeChatById = (id) => {
    let obj = {
        chats: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const chats = yield readFile('chats.json', 'utf-8');
            obj = JSON.parse(chats);
            for (let i = 0; i < chats.length; i++) {
                if (id == obj.chats[i].id) {
                    delete (obj.chats[i]);
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            const file = yield writeFile('chats.json', json, 'utf-8');
        }
        catch (err) {
            console.log(err);
        }
    }))();
};
exports.removeUserByPhone = (phone) => {
    let obj = {
        users: Array()
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const readFile = util_1.promisify(fs.readFile);
            const users = yield readFile('users.json', 'utf-8');
            obj = JSON.parse(users);
            for (let i = 0; i < users.length; i++) {
                if (phone == obj.users[i].phone) {
                    delete (obj.users[i]);
                }
            }
            let json = JSON.stringify(obj);
            const writeFile = util_1.promisify(fs.writeFile);
            const file = yield writeFile('users.json', json, 'utf-8');
        }
        catch (err) {
            console.error(err);
        }
    }))();
};
//# sourceMappingURL=index.js.map