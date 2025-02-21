import { Router } from 'express';
import { ChatController } from '../../application/controllers/ChatController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';

const router = Router();

// GET /api/chats?userId=4
router.get('/', asyncHandler(ChatController.getUserChats));

export default router;