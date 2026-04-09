import { Router } from 'express';
import { getGameDetails } from '../controllers/rawg.controller.js';

const router = Router();

router.get('/:slug', getGameDetails);

export default router;
