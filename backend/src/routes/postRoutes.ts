import express from 'express';
import { createPost, deletePost, getNumberOfPostsByUser, getPostListByUser, getPosts, getPostsByUser } from '../controllers/postController.ts';
import { getUser, upload } from '../middlewares/index.ts';
const router = express.Router();

router.post('/',upload.array('images'), getUser ,createPost);
router.get('/', getUser,getPosts);
router.get('/user',getUser, getPostsByUser);
router.get('/user/list', getUser, getPostListByUser);
router.get('/user/count', getUser,getNumberOfPostsByUser);
router.delete('/:id', getUser, deletePost);    

export default router;