import { Router } from 'express';
// import { ExploreController } from '../controllers/explore.controller';

const router = Router();

// ==========================================
// 🧭 NAVEGACIÓN
// ==========================================

// Obtener lista de colecciones (Cajas temáticas: 'Relax', 'Shooter', etc.)
// router.get('/collections', ExploreController.getCollections);

// Obtener juegos dentro de una colección específica
// router.get('/collections/:id', ExploreController.getCollectionGames);

// Buscador global (por título o desarrollador)
// router.get('/search', ExploreController.searchGames);


// ==========================================
// 🛡️ ZONA ADMIN
// ==========================================

// Crear una nueva colección temática
// router.post('/collections', ExploreController.createCollection);

// Editar una colección
// router.put('/collections/:id', ExploreController.updateCollection);

// Eliminar una colección
// router.delete('/collections/:id', ExploreController.deleteCollection);

export default router;