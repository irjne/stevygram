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
//import { userOnSession, authorization } from './users';
const chats_1 = require("../lib/chats");
const router = express_1.default.Router();
//GET - url: /, stampa tutte le chat
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let chats;
        if (userOnSession) {
            chats = yield chats_1.getAllChats(userOnSession);
        }
        else
            chats = yield chats_1.getAllChats();
        res.json(chats);
    }
    catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
}));
exports.default = router;
//# sourceMappingURL=mongooseChats.js.map