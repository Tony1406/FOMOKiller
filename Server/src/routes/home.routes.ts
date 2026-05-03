import { Router } from 'express';
import { getAllGames } from '../controllers/home.controller.js';
const router = Router();

router.get('/all', getAllGames);

export default router;