import { Router } from 'express';
import { getAllGames, getSwipeDeck, getGameDetails, createGame, updateGame, deleteGame } from '../controllers/home.controller.js';
const router = Router();

router.get('/all', getAllGames);
router.get('/swipe', getSwipeDeck);

router.get('/details/:id', getGameDetails);

router.post('/create', createGame);

router.put('/update/:id', updateGame);

router.delete('/delete/:id', deleteGame);

export default router;