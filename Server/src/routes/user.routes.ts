import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller.js';

const userRoutes = Router();

// GET /users
userRoutes.get('/', getAllUsers);


export default userRoutes;