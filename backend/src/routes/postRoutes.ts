import express from 'express';
import { createPost } from '../controllers/postController.ts';
import { upload } from '../middlewares/index.ts';
const router = express.Router();

router.post('/create', upload.array('images') ,createPost);

export default router;