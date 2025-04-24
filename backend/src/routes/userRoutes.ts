import express from 'express';
import { getAllUsers, updateStatus } from '../controllers/userController.ts';
import { upload } from '../middlewares/index.ts';
import { verifyAdmin } from '../middlewares/index.ts';

const router = express.Router();

router.get("/getAllUsers", verifyAdmin ,getAllUsers);

router.post("/updateStatus", updateStatus);

export default router;