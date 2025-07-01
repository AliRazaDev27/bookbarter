import express from 'express';
import { getUser } from '../middlewares/index.ts';
import { sendMessage, getMessages, updateMessageStatus, getContact } from '../controllers/messageController.ts';

const router = express.Router();

router.post('/', getUser, sendMessage);
router.get('/', getUser, getMessages);
router.put('/:id', getUser, updateMessageStatus);
router.get('/contact/:id', getContact);

export default router;
