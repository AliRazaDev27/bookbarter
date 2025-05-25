import express from 'express';
import { getUser } from '../middlewares/index.ts';
import { createReview } from '../controllers/reviewController.ts';
const router = express.Router();

router.post('/', getUser, createReview)

export default router;