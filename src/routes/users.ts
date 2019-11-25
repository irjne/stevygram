import express from 'express';
import { getAllUsers, addUser, changeUserByPhone, removeUserByPhone } from '../index';

const router = express.Router();

//GET - url: /, stampa tutti gli utenti.
router.get('/', async (req, res) => {
    getAllUsers().then(res => {
        return res.json(res);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
})

//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', (req, res) => {
    let phone = req.params.phone;
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    let result = changeUserByPhone(nickname, name, surname, phone);

    if (typeof (result) == "object") return res.json(result);
    return res.status(404).send("Unexpected error.");
})

//POST - url: /, aggiunge un utente nell'app + BODY.
router.post('/', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    let phone = req.body.phone;
    let result = addUser(nickname, name, surname, phone);

    if (typeof (result) == "object") return res.json(result);
    return res.status(404).send("Unexpected error.");
})

//DELETE - url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', (req, res) => {
    let phone = req.params.phone;
    res.json(removeUserByPhone(phone));
})

export default router; 