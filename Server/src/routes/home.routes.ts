import { Router } from 'express';
// import { GameController } from '../controllers/game.controller';

const router = Router();

// ==========================================
// 👤 ZONA USUARIO (Jugar)
// ==========================================

// Obtener el mazo de cartas para el Swipe
// router.get('/swipe', GameController.getSwipeDeck);

// Ver ficha técnica detallada de un juego
// router.get('/:id', GameController.getGameDetails);


// ==========================================
// 🛡️ ZONA ADMIN (Gestión del Catálogo)
// ==========================================

// Crear un nuevo juego en la BBDD
// router.post('/', GameController.createGame);

// Editar datos de un juego (ej. corregir fecha o imagen)
// router.put('/:id', GameController.updateGame);

// Borrar un juego del catálogo
// router.delete('/:id', GameController.deleteGame);

export default router;