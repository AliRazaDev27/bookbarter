import express from 'express';
import { createRequest, sentRequests, receivedRequests,updateRequestStatus, sendProposal } from '../controllers/requestController.ts';


const router = express.Router();

router.post('/', createRequest);
router.get('/sent', sentRequests);
router.get('/received', receivedRequests);
router.put('/status/:id', updateRequestStatus);
router.put('/sendProposal/:id', sendProposal);

export default router;