//import { expect } from 'chai';
import 'mocha';
import * as methods from '../index';
const request = require('supertest');
const app = require('../app');
const assert = require('assert');

/*describe("GET /chats/:id/users", () => {
    it("should return 200 if the db is accessible", () => {
        request(app)
        .get('/chats/1/users')
        .end((err: any, res: any) => {
            if (err) return err;
            return res; 
        });
    });
  });*/

describe('#addUser', () => {
    let result = methods.addUser("MainframeTv", "Gabriele", "Connelli", "+393482523775");
    it('should return a string if the user has been added', () => {
        assert.isString(result);
        assert.include(result, 'MainframeTv');
    })

    /*it('should return an error if the user hasn\'t been added', () => {
        assert.isNotString(result);
        assert.notInclude(result);
    })*/
});

describe('#addChat', () => {
    it('should return a string if the chat has been added', () => {
        let result = methods.addChat(5, "Quelli che... si disperano", "Help us, pls", ["+393466457463", "+393286239190", "+393451691678"])
        assert.isString(result);
        assert.include(result, 'Quelli che... si disperano');
    })

    /*it('should return an error if the chat hasn\'t been added', () => {
        assert.isNotString(result);
        assert.notInclude(result);
    })*/
});

describe('#getUsersByChatId', () => {
    it('should return an array if the chat exists', () => {
        let result = methods.getUsersByChatId(2);
        assert.isArray(result);
    })
});