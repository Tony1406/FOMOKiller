import { Router } from 'express';
import { getBacklog, getPriorities, updateStatus, setPriority, markFinished, clearBacklog, reorderPriorities } from '../controllers/myGames.controller.js';
const router = Router();

router.get('/backlog', getBacklog);

router.get('/priorities', getPriorities);

router.put('/status', updateStatus);

router.put('/priority', setPriority);

router.put('/priorities/reorder', reorderPriorities);

router.put('/finish', markFinished);

router.delete('/clear', clearBacklog);

export default router;