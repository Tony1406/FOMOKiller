import { Router } from 'express';
// import { UserController } from '../controllers/user.controller';

const router = Router();

// ==========================================
// 🔐 AUTENTICACIÓN
// ==========================================

// Registro de usuario nuevo
// router.post('/register', UserController.register);

// Iniciar sesión (Devuelve Token)
// router.post('/login', UserController.login);


// ==========================================
// 👤 PERFIL
// ==========================================

// Ver perfil de usuario (Avatar, Banner, Bio, Top 5)
// router.get('/profile/:id', UserController.getProfile);

// Editar mi propio perfil
// router.patch('/profile', UserController.updateProfile);


// ==========================================
// 🤝 AMIGOS (Social Básico)
// ==========================================

// Listar mis amigos confirmados
// router.get('/friends', UserController.getFriends);

// Enviar solicitud de amistad
// router.post('/friends/request', UserController.sendFriendRequest);

// Aceptar solicitud de amistad
// router.patch('/friends/accept', UserController.acceptFriendRequest);

export default router;