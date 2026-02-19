import { Router } from 'express';
import { getSwipeDeck, getGameDetails, createGame, updateGame, deleteGame } from '../controllers/home.controller.js';
const router = Router();

// ==========================================
// ZONA USUARIO (Jugar)
// ==========================================

router.get('/swipe', getSwipeDeck);

router.get('/details/:id', getGameDetails);


// ==========================================
// ZONA ADMIN (Gestión del Catálogo)
// ==========================================

router.post('/create', createGame);

router.put('/update/:id', updateGame);

router.delete('/delete/:id', deleteGame);

export default router;