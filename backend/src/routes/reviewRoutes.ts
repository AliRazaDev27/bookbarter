import express from 'express';
import { getUser } from '../middlewares/index.ts';
import { createReview,getReviewReceived } from '../controllers/reviewController.ts';
const router = express.Router();

router.post('/', getUser, createReview);
router.get('/received', getUser, getReviewReceived);

export default router;