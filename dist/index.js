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
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const readFile = util_1.promisify(fs_1.default.readFile);
function promisedReadFile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = yield readFile('/info.json', 'utf-8');
            return file;
        }
        catch (err) {
            console.error(err);
            return;
        }
    });
}
const writeFile = util_1.promisify(fs_1.default.writeFile);
function promisedWriteFile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = yield writeFile('/info.json', 'utf-8');
        }
        catch (err) {
            console.log(err);
            return;
        }
    });
}
let users = [];
promisedReadFile().then(item => {
    users = JSON.parse(item ? item : "[]");
});
exports.getAllUsers = () => {
    console.log(users);
    return;
};
exports.getAllUsers();
//# sourceMappingURL=index.js.map