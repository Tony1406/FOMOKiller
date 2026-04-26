import { Router } from 'express';
import { register, login, getMe, logout, getProfile, updateProfile } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

router.post('/register', register);

router.post('/login', login);

router.get('/profile/:userId', getProfile);

router.put('/profile/:userId', updateProfile);


export default router;