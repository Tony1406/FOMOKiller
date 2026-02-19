import { User } from '../models/UserModel.js';
import { Friendship } from '../models/FriendshipModel.js';
import { Op } from 'sequelize';
import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(Number(userId), {
            attributes: { exclude: ['passwordHash'] }
        });

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const [updatedRows] = await User.update(req.body, { where: { id: Number(userId) } });
        if (updatedRows > 0) {
            const updatedUser = await User.findByPk(Number(userId), { attributes: { exclude: ['passwordHash'] } });
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "Usuario no encontrado para editar" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

export const getFriends = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};