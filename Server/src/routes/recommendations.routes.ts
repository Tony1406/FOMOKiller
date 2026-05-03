import { Router } from 'express';
import { savePreferences, getPreferences, getRecommendations, toggleIgnoreHistory, resetHistory } from '../controllers/recommendations.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.post('/preferences', savePreferences);
router.get('/preferences/:userId', getPreferences);
router.patch('/preferences/:userId/toggle-exploration', toggleIgnoreHistory);
router.patch('/preferences/:userId/reset-history', resetHistory);
router.get('/:userId', getRecommendations);

export default router;
