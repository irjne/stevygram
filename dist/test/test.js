"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { expect } from 'chai';
require("mocha");
const assert = require('assert');
describe('#addMessage', () => {
    let users = [new User("MainframeTv", "Gabriele", "Connelli", "3456789678"), new User("tano.carfi", "Gaetano", "Carfì", "3456789789")];
    it('should return 1 if it can be add a new message', () => {
        let sender = new User("MainframeTv", "Gabriele", "Connelli", "3456789678");
        let message = new Message(sender, "Ciao, come stai?");
        assert.isBoolean(addMessage(message));
        assert.include(users, sender);
        assert.equals(addMessage(message), 1);
    });
    it('should return 0 if the sender doesn\'t exists', () => {
        let sender = new User("irjne", "Daria", "Gilletti", "3456789456");
        let message = new Message(sender, "Ciao, come stai?");
        let isAnUser = false;
        //verifica che il sender sia un utente
        assert.isBoolean(addMessage(message));
        assert.notInclude(users, sender);
        assert.equal(addMessage(message), 0);
    });
});
//# sourceMappingURL=test.js.map