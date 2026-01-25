import { Router } from 'express';
import { getAllGames } from '../controllers/game.controller.js';

const gameRoutes = Router();

// GET /games
gameRoutes.get('/', getAllGames);

export default gameRoutes;