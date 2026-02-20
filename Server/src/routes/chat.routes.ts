import { Router } from 'express';
import { getContacts, getHistory, sendMessage, askAI } from '../controllers/chat.controller.js';
const router = Router();

router.get('/contacts', getContacts);

router.get('/history/:friendId', getHistory);

router.post('/send', sendMessage);

router.post('/askAI', askAI);

export default router;