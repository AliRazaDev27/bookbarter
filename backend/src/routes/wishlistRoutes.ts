import express from 'express';
import { getUser } from '../middlewares/index.ts';
import { createWishlist, deleteWishlist, getWishlist, getWishlistCount } from '../controllers/wishlistController.ts';
const router = express.Router();

router.post('/',getUser,createWishlist);
router.get('/',getUser, getWishlist);
router.get('/count',getUser, getWishlistCount);
router.delete('/:id',getUser, deleteWishlist);

export default router;