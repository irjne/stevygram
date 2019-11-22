//import { expect } from 'chai';
import 'mocha';
import * as methods from '../index'; 
const assert = require('assert');

describe('#addUser', () => {
    it('should return a string if the chat has been added', () => {
        let result = methods.addUser("MainframeTv", "Gabriele", "Connelli", "+393482523775");
        assert.isString(result);
        assert.include(result, 'MainframeTv');
    })

    /*it('should return an error if the chat hasn\'t been added', () => {
        assert.isNotString(methods.addUser("MainframeTv", "Gabriele", "Connelli", "+393482523775"));
        assert.notInclude(methods.addUser("MainframeTv", "Gabriele", "Connelli", "+393482523775"), 'MainframeTv');
    })*/
});

describe('#getUsersByChatId', () => {
    it('should return an array if the chat exists', () => {
        let result = methods.getUsersByChatId(2);
        assert.isArray(result);
    })
});