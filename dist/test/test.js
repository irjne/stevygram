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
require("mocha");
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const app = require('../app');
describe("users.ts API", () => {
    it("GET /users - should return all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get('/users');
        chai_1.expect(result.status).to.equal(200);
        chai_1.expect(result.body).to.be.a('array');
    }));
    it("PUT /users/:phone - should return a message", () => __awaiter(void 0, void 0, void 0, function* () {
        const phone = "3466457463";
        const nickname = "irjne";
        const result = yield supertest_1.default(app).put('/users/' + phone)
            .send({ "phone": phone, "nickname": nickname });
        chai_1.expect(result.status).to.equal(200);
        chai_1.expect(result.body).to.be.a('string');
    }));
    it("POST /users - should return a message", () => __awaiter(void 0, void 0, void 0, function* () {
        const phone = "3482523775";
        const nickname = "MainframeTV";
        const name = "Gabriele";
        const surname = "Connelli";
        const result = yield supertest_1.default(app).post('/users/')
            .send({ "nickname": nickname, "name": name, "surname": surname, "phone": phone });
        chai_1.expect(result.status).to.equal(200);
        chai_1.expect(result.body).to.be.a('string');
    }));
    it("DELETE /users/:phone - should return a message", () => __awaiter(void 0, void 0, void 0, function* () {
        const phone = "3482523775";
        const result = yield supertest_1.default(app).delete('/users/' + phone)
            .send({ "phone": phone });
        chai_1.expect(result.status).to.equal(200);
        chai_1.expect(result.body).to.be.a('string');
    }));
});
describe("chats.ts API", () => {
    describe("GET /chats", () => {
        it("should return all chats", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield supertest_1.default(app).get('/chats');
            chai_1.expect(result.status).to.equal(200);
            chai_1.expect(result.body).to.be.a('object');
        }));
    });
    describe("GET /chats/:id/users", () => {
        it("should return all users of a specific chat if it exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 2;
            const result = yield supertest_1.default(app).get('/chats/' + id + '/users');
            chai_1.expect(result.status).to.equal(200);
            chai_1.expect(result.body).to.be.a('array');
        }));
        it("should return a 404 status if the chat doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 10000;
            const result = yield supertest_1.default(app).get('/chats/' + id + '/users');
            chai_1.expect(result.status).to.equal(404);
        }));
    });
    describe("GET /chats/:id", () => {
        it("should return all info of a specific chat if it exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 2;
            const result = yield supertest_1.default(app).get('/chats/' + id);
            chai_1.expect(result.status).to.equal(200);
            chai_1.expect(result.body).to.be.a('array');
            chai_1.expect(result.body).to.have.lengthOf(2);
        }));
        it("should return a 404 status if the chat doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 10000;
            const result = yield supertest_1.default(app).get('/chats/' + id);
            chai_1.expect(result.status).to.equal(404);
        }));
    });
    describe("GET /chats/:id/messages", () => {
        it("should return all info of a specific chat if it exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 2;
            const result = yield supertest_1.default(app).get('/chats/' + id + '/messages');
            chai_1.expect(result.status).to.equal(200);
            chai_1.expect(result.body).to.be.a('array');
        }));
        it("should return a 404 status if the chat doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 10000;
            const result = yield supertest_1.default(app).get('/chats/' + id + '/messages');
            chai_1.expect(result.status).to.equal(404);
        }));
    });
});
//# sourceMappingURL=test.js.map