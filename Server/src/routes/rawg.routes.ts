import { Router } from 'express';
import { getGameDetails } from '../controllers/rawg.controller.js';
import { getGameTrailer, getGameplayVideo } from '../controllers/youtube.controller.js';

const router = Router();

router.get('/:slug/trailer', getGameTrailer);
router.get('/:slug/gameplay', getGameplayVideo);
router.get('/:slug', getGameDetails);

export default router;
