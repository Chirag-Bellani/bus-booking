import express from 'express';
import { loginOrSignUp,refreshToken } from '../controllers/user.js';

const user=express.Router()

router.post('/login',loginOrSignUp)
router.post('/refresh',refreshToken)

export default router;