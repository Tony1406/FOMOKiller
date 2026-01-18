import { Router } from 'express';
import { getAllGames } from '../controllers/game.controller.ts';

const router = Router();

router.get('/', getAllGames);
// router.post('/', createGame); ...etc

export default router;