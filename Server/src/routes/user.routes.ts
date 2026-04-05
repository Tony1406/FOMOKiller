import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/user.controller.js';

import { getMe, logout } from '../controllers/user.controller.js';


const router = Router();
router.get('/me', getMe);
router.post('/logout', logout);

router.post('/register', register);

router.post('/login', login);

router.get('/profile/:userId', getProfile);

router.put('/profile/:userId', updateProfile);


export default router;