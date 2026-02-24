import { Router } from 'express';
import { getBacklog, getPriorities, updateStatus, setPriority, markFinished, dropGame, checkIsPriority, checkIsFinished } from '../controllers/myGames.controller.js';
const router = Router();

router.get('/backlog', getBacklog);

router.get('/priorities', getPriorities);

router.put('/status', updateStatus);

router.put('/priority', setPriority);

router.put('/finish', markFinished);

router.delete('/delete/:gameId', dropGame);

router.get('/isPriority/:gameId', checkIsPriority);

router.get('/isFinished/:gameId', checkIsFinished);

export default router;