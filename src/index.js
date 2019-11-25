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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var util_1 = require("util");
var fs = require("fs");
exports.addUser = function (nickname, name, surname, phone) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, users, json, writeFile, file, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    users: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('users.json', 'utf-8')];
            case 2:
                users = _a.sent();
                obj = JSON.parse(users);
                obj.users.push({ nickname: nickname, name: name, surname: surname, phone: phone });
                json = JSON.stringify(obj);
                writeFile = util_1.promisify(fs.writeFile);
                return [4 /*yield*/, writeFile('users.json', json, 'utf-8')];
            case 3:
                file = _a.sent();
                return [2 /*return*/, "User " + nickname + " added successfully."];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [2 /*return*/, err_1];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addChat = function (name, description, users) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, json, writeFile, file, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                obj.chats.push({ name: name, description: description });
                json = JSON.stringify(obj);
                writeFile = util_1.promisify(fs.writeFile);
                return [4 /*yield*/, writeFile('chats.json', json, 'utf-8')];
            case 3:
                file = _a.sent();
                return [2 /*return*/, "Chat " + name + " added successfully."];
            case 4:
                err_2 = _a.sent();
                return [2 /*return*/, err_2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllChats = function () { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                return [2 /*return*/, obj];
            case 3:
                err_3 = _a.sent();
                return [2 /*return*/, err_3];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, users, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    users: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('users.json', 'utf-8')];
            case 2:
                users = _a.sent();
                obj = JSON.parse(users);
                return [2 /*return*/, obj.users];
            case 3:
                err_4 = _a.sent();
                return [2 /*return*/, err_4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUsersByChatId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                return [2 /*return*/, obj.chats[id].users];
            case 3:
                err_5 = _a.sent();
                return [2 /*return*/, err_5];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getInfoByChatId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                return [2 /*return*/, [obj.chats[id].name, obj.chats[id].description]];
            case 3:
                err_6 = _a.sent();
                return [2 /*return*/, err_6];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMessagesByChatId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                console.log(obj.chats[id].messages);
                return [2 /*return*/, obj.chats[id].messages];
            case 3:
                err_7 = _a.sent();
                return [2 /*return*/, err_7];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.changeInfoByChatId = function (id, name, description) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, i, json, writeFile, file, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                for (i = 0; i < chats.length; i++) {
                    if (id == obj.chats[i].id) {
                        if (name)
                            obj.chats[i].name = name;
                        if (description)
                            obj.chats[i].description = description;
                    }
                }
                json = JSON.stringify(obj);
                writeFile = util_1.promisify(fs.writeFile);
                return [4 /*yield*/, writeFile('chats.json', json, 'utf-8')];
            case 3:
                file = _a.sent();
                return [2 /*return*/, "Chat " + name + " changed successfully."];
            case 4:
                err_8 = _a.sent();
                return [2 /*return*/, err_8];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.changeUserByPhone = function (phone, nickname, name, surname) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, i, json, writeFile, file, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    users: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('users.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                for (i = 0; i < chats.length; i++) {
                    if (phone == obj.users[i].phone) {
                        if (nickname)
                            obj.users[i].nickname = nickname;
                        if (name)
                            obj.users[i].name = name;
                        if (surname)
                            obj.users[i].surname = surname;
                    }
                }
                json = JSON.stringify(obj);
                writeFile = util_1.promisify(fs.writeFile);
                return [4 /*yield*/, writeFile('users.json', json, 'utf-8')];
            case 3:
                file = _a.sent();
                return [2 /*return*/, "User " + nickname + " (" + phone + ") changed successfully."];
            case 4:
                err_9 = _a.sent();
                return [2 /*return*/, err_9];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removeChatById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, chats, i, json, writeFile, file, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    chats: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('chats.json', 'utf-8')];
            case 2:
                chats = _a.sent();
                obj = JSON.parse(chats);
                for (i = 0; i < chats.length; i++) {
                    if (id == obj.chats[i].id) {
                        delete (obj.chats[i]);
                    }
                }
                json = JSON.stringify(obj);
                writeFile = util_1.promisify(fs.writeFile);
                return [4 /*yield*/, writeFile('chats.json', json, 'utf-8')];
            case 3:
                file = _a.sent();
                return [2 /*return*/, "Chat " + id + " removed successfully."];
            case 4:
                err_10 = _a.sent();
                return [2 /*return*/, err_10];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removeUserByPhone = function (phone) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, readFile, users, i, json, writeFile, file, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = {
                    users: Array()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                readFile = util_1.promisify(fs.readFile);
                return [4 /*yield*/, readFile('users.json', 'utf-8')];
            case 2:
                users = _a.sent();
                obj = JSON.parse(users);
                for (i = 0; i < users.length; i++) {
                    if (phone == obj.users[i].phone) {
                        delete (obj.users[i]);
                    }
                }
                json = JSON.stringify(obj);
                writeFile = util_1.promisify(fs.writeFile);
                return [4 /*yield*/, writeFile('users.json', json, 'utf-8')];
            case 3:
                file = _a.sent();
                return [2 /*return*/, "User " + phone + " removed successfully."];
            case 4:
                err_11 = _a.sent();
                return [2 /*return*/, err_11];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllChats().then(function (res) {
    console.log(res);
})["catch"](function (err) {
    console.log(err);
});
