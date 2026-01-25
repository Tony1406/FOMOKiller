import { User } from '../models/UserModel.js';
import type { Request, Response } from 'express';

// GET: Obtener todos los usuarios
// Mongoose: User.find()
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};