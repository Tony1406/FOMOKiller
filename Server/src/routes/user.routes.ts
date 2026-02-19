import { Router } from 'express';
import { register, login, getProfile, updateProfile, getFriends, sendFriendRequest, acceptFriendRequest } from '../controllers/user.controller.js';
const router = Router();

// ==========================================
// AUTENTICACIÓN
// ==========================================

router.post('/register', register);

router.post('/login', login);


// ==========================================
// PERFIL
// ==========================================

router.get('/profile/:userId', getProfile);

router.put('/profile/:userId', updateProfile);


// ==========================================
// AMIGOS (Social Básico)
// ==========================================

router.get('/friends', getFriends);

router.post('/friends/request', sendFriendRequest);

router.put('/friends/accept', acceptFriendRequest);

export default router;