import express from 'express';
import { createRequest, sentRequests, receivedRequests,updateRequestStatus, sendProposal, deleteRequest } from '../controllers/requestController.ts';
import { getUser } from '../middlewares/index.ts';


const router = express.Router();

router.post('/', getUser,createRequest);
router.get('/sent', getUser,sentRequests);
router.get('/received', getUser,receivedRequests);
router.put('/status/:id', getUser,updateRequestStatus);
router.put('/sendProposal/:id', getUser,sendProposal);
router.delete('/:type/:id', getUser,deleteRequest);
export default router;