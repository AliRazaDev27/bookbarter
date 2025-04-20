import express from 'express';
import { getAllUsers, loginUser, registerUser, updateStatus } from '../controllers/userController.ts';
import { upload } from '../middlewares/index.ts';
import { verifyAdmin } from '../middlewares/index.ts';

const router = express.Router();

router.post("/registerUser", upload.single("picture"), registerUser);

router.post("/login", loginUser);

router.get("/getAllUsers", verifyAdmin ,getAllUsers);

router.post("/updateStatus", updateStatus);

export default router;