import 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
const app = require('../app');

describe("users.ts API", () => {
    it("GET /users - should return all users", async () => {
        const result = await supertest(app).get('/users');
        expect(result.status).to.equal(200);
        expect(result.body).to.be.a('array');
    });

    it("PUT /users/:phone - should return a message", async () => {
        const phone = "3466457463";
        const nickname = "irjne";
        const result = await supertest(app).put('/users/' + phone)
            .send({ "phone": phone, "nickname": nickname });
        expect(result.status).to.equal(200);
        expect(result.body).to.be.a('string');
    });

    it("POST /users - should return a message", async () => {
        const phone = "3482523775";
        const nickname = "MainframeTV";
        const name = "Gabriele";
        const surname = "Connelli";
        const result = await supertest(app).post('/users/')
            .send({ "nickname": nickname, "name": name, "surname": surname, "phone": phone });
        expect(result.status).to.equal(200);
        expect(result.body).to.be.a('string');
    });

    it("DELETE /users/:phone - should return a message", async () => {
        const phone = "3482523775";
        const result = await supertest(app).delete('/users/' + phone)
            .send({ "phone": phone });
        expect(result.status).to.equal(200);
        expect(result.body).to.be.a('string');
    });
});

describe("chats.ts API", () => {
    describe("GET /chats", () => {
        it("should return all chats", async () => {
            const result = await supertest(app).get('/chats');
            expect(result.status).to.equal(200);
            expect(result.body).to.be.a('object');
        });
    });

    describe("GET /chats/:id/users", () => {
        it("should return all users of a specific chat if it exists", async () => {
            const id = 2;
            const result = await supertest(app).get('/chats/' + id + '/users');
            expect(result.status).to.equal(200);
            expect(result.body).to.be.a('array');
        });

        it("should return a 404 status if the chat doesn't exist", async () => {
            const id = 10000;
            const result = await supertest(app).get('/chats/' + id + '/users');
            expect(result.status).to.equal(404);
        });
    });

    describe("GET /chats/:id", () => {
        it("should return all info of a specific chat if it exists", async () => {
            const id = 2;
            const result = await supertest(app).get('/chats/' + id);
            expect(result.status).to.equal(200);
            expect(result.body).to.be.a('array');
            expect(result.body).to.have.lengthOf(2);
        });

        it("should return a 404 status if the chat doesn't exist", async () => {
            const id = 10000;
            const result = await supertest(app).get('/chats/' + id);
            expect(result.status).to.equal(404);
        });
    });

    describe("GET /chats/:id/messages", () => {
        it("should return all info of a specific chat if it exists", async () => {
            const id = 2;
            const result = await supertest(app).get('/chats/' + id + '/messages');
            expect(result.status).to.equal(200);
            expect(result.body).to.be.a('array');
        });

        it("should return a 404 status if the chat doesn't exist", async () => {
            const id = 10000;
            const result = await supertest(app).get('/chats/' + id + '/messages');
            expect(result.status).to.equal(404);
        });
    })
});