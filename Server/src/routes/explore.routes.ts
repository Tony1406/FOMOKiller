import { Router } from 'express';
import { getCollections, getCollectionGames, searchGames, createCollection, updateCollection, deleteCollection } from '../controllers/explore.controller.js';
const router = Router();

// ==========================================
// NAVEGACIÓN
// ==========================================

router.get('/collections', getCollections);

router.get('/collections/:collectionId', getCollectionGames);

router.get('/search', searchGames);


// ==========================================
// ZONA ADMIN
// ==========================================

router.post('/collections', createCollection);

router.put('/collections/:collectionId', updateCollection);

router.delete('/collections/:collectionId', deleteCollection);

export default router;