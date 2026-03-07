import { User } from '../models/UserModel.js';
import { Friendship } from '../models/FriendshipModel.js';
import { Op } from 'sequelize';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_fomokiller_2026';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: "Ya existe un usuario con ese email" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            username,
            email,
            passwordHash: hashedPassword
        });

        const newUser = createdUser.toJSON() as { id: number; username: string; email: string };

        const token = jsonwebtoken.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ where: { email } });
        if (!foundUser) {
            res.status(401).json({ error: "Credenciales incorrectas" });
            return;
        }

        const user = foundUser.toJSON() as { id: number; username: string; email: string; passwordHash: string; role: string };

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: "Credenciales incorrectas" });
            return;
        }

        const token = jsonwebtoken.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión" });
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