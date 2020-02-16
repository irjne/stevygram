import express from 'express';
import { Request, Response } from 'express';

// initializing express router
const router = express.Router();


router.get('/', async (req: Request, res: Response) => {
    res.json('I\'m alive')
});

router.get("/socket.io", async (req: Request, res: Response) => {
    // http://localhost:3005/socket.io/?EIO=3&transport=polling&t=N1F3sMZ

    const { EIO, transport, t } = req.query;
    console.log(req.query);
});

router.get("/socket.io/send-message", async (req: Request, res: Response) => {
    // http://localhost:3005/socket.io/?EIO=3&transport=polling&t=N1F3sMZ

    console.log('prova a muzzo');
});


export default router;