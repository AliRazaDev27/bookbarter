import express from 'express';
import { createPost, getPosts, getPostsByUser } from '../controllers/postController.ts';
import { upload } from '../middlewares/index.ts';
const router = express.Router();

router.post('/', upload.array('images') ,createPost);
router.get('/', getPosts);
router.get('/user', getPostsByUser);

export default router;