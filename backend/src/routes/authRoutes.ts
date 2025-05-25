import express from 'express';
import {login,logout,register,session} from '../controllers/authController.ts';
import { getUser, upload } from '../middlewares/index.ts';

const router = express.Router();

router.post('/register', upload.single('picture') ,register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/session', getUser,session);

export default router;