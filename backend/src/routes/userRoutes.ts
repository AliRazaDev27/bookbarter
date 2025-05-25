import express from 'express';
import { getAllUsers, updateStatus } from '../controllers/userController.ts';
import { getUser } from '../middlewares/index.ts';

const router = express.Router();

router.get("/getAllUsers", getUser ,getAllUsers);

router.post("/updateStatus", getUser,updateStatus);

export default router;