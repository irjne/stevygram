import express from 'express';

// initializing express router
const router = express.Router();


router.get('/', async (req: any, res: any) => {
    res.json('I\'m alive')
});

export default router;