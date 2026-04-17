import { Router } from 'express';
import { savePreferences, getPreferences, getRecommendations, toggleIgnoreHistory, resetHistory } from '../controllers/recommendations.controller.js';

const router = Router();

router.post('/preferences', savePreferences);
router.get('/preferences/:userId', getPreferences);
router.patch('/preferences/:userId/toggle-exploration', toggleIgnoreHistory);
router.patch('/preferences/:userId/reset-history', resetHistory);
router.get('/:userId', getRecommendations);

export default router;
