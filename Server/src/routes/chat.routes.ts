import { Router } from 'express';
import { getContacts, getHistory, sendMessage, askAI } from '../controllers/chat.controller.js';
const router = Router();

// ==========================================
// MENSAJERÍA
// ==========================================

router.get('/contacts', getContacts);

router.get('/history/:friendId', getHistory);

router.post('/send', sendMessage);


// ==========================================
// INTELIGENCIA ARTIFICIAL
// ==========================================

router.post('/askAI', askAI);

export default router;