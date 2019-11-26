import express from 'express';
import { getAllUsers, addUser, changeUserByPhone, removeUserByPhone } from '../index';

const router = express.Router();

//GET - url: /, stampa tutti gli utenti.
router.get('/', async (req, res) => {
    getAllUsers().then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
})

//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', async (req, res) => {
    const { name, phone, surname, nickname } = req.body;
    try {
        const result = await changeUserByPhone(nickname, name, surname, phone);
        res.json(result);
    } catch (err) {
        return res.status(404).send(`Unexpected error: ${err}`);
    }
})

//POST - url: /, aggiunge un utente nell'app + BODY.
router.post('/', async (req, res) => {
    console.log(req.body);
    let name = String(req.body.name);
    let surname = String(req.body.surname);
    let nickname = String(req.body.nickname);
    let phone = String(req.body.phone);

    addUser(nickname, name, surname, phone).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
})

//DELETE - url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', async (req, res) => {
    let phone = String(req.params.phone);
    console.log(phone);

    removeUserByPhone(phone).then(result => {
        return res.json(result);
    }).catch(err => {
        return res.status(404).send(`Unexpected error: ${err}`);
    });
})

export default router; 