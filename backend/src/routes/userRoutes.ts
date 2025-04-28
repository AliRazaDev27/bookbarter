import express from 'express';
import { getAllUsers, updateStatus } from '../controllers/userController.ts';

const router = express.Router();

router.get("/getAllUsers", getAllUsers);

router.post("/updateStatus", updateStatus);

export default router;