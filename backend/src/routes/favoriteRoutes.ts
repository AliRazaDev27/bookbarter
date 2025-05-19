import express from 'express';
import { toggleFavorite } from '../controllers/favoriteController.ts';

const router = express.Router();
router.put('/toggle/:id', toggleFavorite);

export default router