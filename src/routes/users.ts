import express from 'express';
import * as stevygram from '../index';

const router = express.Router();

//Cluster: /users
//GET - url: /, stampa tutti gli utenti.

router.get('/', (req, res) => {
    res.json(stevygram.getAllUsers());
}) 

//PUT
//- url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', (req, res) => {
    let phone = req.params.phone;
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    res.json(stevygram.changeUserByPhone(nickname, name, surname, phone));
}) 

//POST 
//- url: /, aggiunge un utente nell'app + BODY.
router.post('/', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    let phone = req.body.phone;
    res.json(stevygram.addUser(nickname, name, surname, phone));
}) 

//DELETE 
//- url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', (req, res) => {
    let phone = req.params.phone;
    res.json(stevygram.removeUserByPhone(phone));

})

module.exports = router;