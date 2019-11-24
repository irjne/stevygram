//import { expect } from 'chai';
import 'mocha';
import * as methods from '../index'; 
const assert = require('assert');

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
        let result = methods.addChat("Quelli che... si disperano", "Help us, pls", ["+393466457463", "+393286239190", "+393451691678"])
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