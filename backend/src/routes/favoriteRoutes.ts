import express from 'express';
import { toggleFavorite } from '../controllers/favoriteController.ts';
import { getUser } from '../middlewares/index.ts';

const router = express.Router();
router.put('/toggle/:id', getUser,toggleFavorite);

export default router