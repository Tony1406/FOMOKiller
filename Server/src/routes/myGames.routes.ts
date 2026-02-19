import { Router } from 'express';
import { getBacklog, getPriorities, updateStatus, setPriority, markFinished, dropGame } from '../controllers/myGames.controller.js';
const router = Router();

// ==========================================
// LECTURA (Estado)
// ==========================================

router.get('/backlog', getBacklog);

router.get('/priorities', getPriorities);


// ==========================================
// ACCIONES (Mecánicas)
// ==========================================

router.put('/status', updateStatus);

router.put('/priority', setPriority);

router.put('/finish', markFinished);

router.delete('/delete/:gameId', dropGame);

export default router;