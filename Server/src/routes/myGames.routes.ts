import { Router } from 'express';
// import { UserGameController } from '../controllers/userGame.controller';

const router = Router();

// ==========================================
// 📋 LECTURA (Estado)
// ==========================================

// Ver todo mi Backlog (Juegos con status 'LIKED')
// router.get('/', UserGameController.getBacklog);

// Ver SOLO mis 5 prioridades activas
// router.get('/priorities', UserGameController.getPriorities);


// ==========================================
// ⚡ ACCIONES (Mecánicas)
// ==========================================

// Acción de SWIPE: Dar Like o Dislike
// router.post('/status', UserGameController.updateStatus);

// Mover un juego al Top 5 (Valida si hay hueco)
// router.patch('/priority', UserGameController.setPriority);

// Marcar juego como 'COMPLETED' (Libera hueco en Top 5)
// router.patch('/finish', UserGameController.markFinished);

// Eliminar juego del backlog ('Dropear')
// router.delete('/:gameId', UserGameController.dropGame);

export default router;