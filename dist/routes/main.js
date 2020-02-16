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
// initializing express router
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json('I\'m alive');
}));
router.get("/socket.io", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://localhost:3005/socket.io/?EIO=3&transport=polling&t=N1F3sMZ
    const { EIO, transport, t } = req.query;
    console.log(req.query);
}));
router.get("/socket.io/send-message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://localhost:3005/socket.io/?EIO=3&transport=polling&t=N1F3sMZ
    console.log('prova a muzzo');
}));
exports.default = router;
//# sourceMappingURL=main.js.map