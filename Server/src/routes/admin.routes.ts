import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
    getAllUsers, createUser, updateUser, updateUserRole, deleteUser,
    adminGetAllGames, adminCreateGame, adminUpdateGame, adminDeleteGame, adminGetPlatforms,
    searchRawg, importFromRawg,
    adminGetCollections, adminCreateCollection, adminUpdateCollection, adminDeleteCollection,
    adminGetCollectionGames, adminAddGameToCollection, adminRemoveGameFromCollection,
} from '../controllers/admin.controller.js';

const router = Router();
router.use(requireAdmin);

// Usuarios
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Juegos
router.get('/games', adminGetAllGames);
router.post('/games', adminCreateGame);
router.put('/games/:id', adminUpdateGame);
router.delete('/games/:id', adminDeleteGame);
router.get('/platforms', adminGetPlatforms);

// RAWG
router.get('/rawg/search', searchRawg);
router.post('/rawg/import', importFromRawg);

// Colecciones
router.get('/collections', adminGetCollections);
router.post('/collections', adminCreateCollection);
router.put('/collections/:id', adminUpdateCollection);
router.delete('/collections/:id', adminDeleteCollection);
router.get('/collections/:id/games', adminGetCollectionGames);
router.post('/collections/:id/games', adminAddGameToCollection);
router.delete('/collections/:id/games/:gameId', adminRemoveGameFromCollection);

export default router;
