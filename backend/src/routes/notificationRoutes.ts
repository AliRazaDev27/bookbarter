import express from 'express';
import { getUser } from '../middlewares/index.ts';
import { getNotifications , markNotification, deleteNotification } from '../controllers/notificationController.ts';

const router = express.Router();

router.get('/',getUser,getNotifications);
router.put('/markAsRead/:id', getUser,markNotification);
router.delete('/:id', getUser,deleteNotification);

export default router;
