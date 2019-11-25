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
    let result = stevygram.changeUserByPhone(nickname, name, surname, phone);

    if (typeof(result) == "object") return res.json(result);
    return res.status(404).send("Unexpected error.");
}) 

//POST 
//- url: /, aggiunge un utente nell'app + BODY.
router.post('/', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    let phone = req.body.phone;
    let result = stevygram.addUser(nickname, name, surname, phone);

    if (typeof(result) == "object") return res.json(result);
    return res.status(404).send("Unexpected error.");
}) 

//DELETE 
//- url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', (req, res) => {
    let phone = req.params.phone;
    res.json(stevygram.removeUserByPhone(phone));

})

module.exports = router;