import express from 'express';
import { getAllUsers, addUser, changeUserByPhone, removeUserByPhone } from '../index';

const router = express.Router();

//GET - url: /, stampa tutti gli utenti.
router.get('/', async (req, res) => {
    try{
        const result = await getAllUsers();
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//PUT - url: /:id, modifica un user dando un id + BODY.
router.put('/:phone', async (req, res) => {
    const { name, phone, surname, nickname } = req.body;
    try {
        const result = await changeUserByPhone(nickname, name, surname, phone); 
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }
})

//POST - url: /, aggiunge un utente nell'app + BODY.
router.post('/', async (req, res) => {
    const { name, phone, surname, nickname } = req.body;
    try{
        const result = await addUser(nickname, name, surname, phone);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }     
})

//DELETE - url: /:id, cancella l'utente avendo l'id.
router.delete(':phone', async (req, res) => {
    let phone = String(req.params.phone);
    try{
        const result = await removeUserByPhone(phone);
        res.json(result);
    } catch (err) {
        return res.status(400).send(`Unexpected error: ${err}`);
    }  
})
export default router; 