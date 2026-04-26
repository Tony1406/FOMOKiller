import type { Request, Response } from 'express';
import { User } from '../models/UserModel.js';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['passwordHash'] },
            order: [['id', 'ASC']],
        });
        res.json(users);
    } catch {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, bio, avatarUrl } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }
        const existing = await User.findOne({ where: { email } });
        if (existing) { res.status(409).json({ error: 'Ya existe un usuario con ese email' }); return; }
        const bcrypt = await import('bcrypt');
        const passwordHash = await bcrypt.default.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: role || 'user', bio: bio || null, avatarUrl: avatarUrl || null });
        const json = user.toJSON() as any;
        delete json.passwordHash;
        res.status(201).json(json);
    } catch {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email, role, password, bio, avatarUrl } = req.body;
        if (role && !['admin', 'user'].includes(role)) {
            res.status(400).json({ error: 'Rol inválido' });
            return;
        }
        const updates: any = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (bio !== undefined) updates.bio = bio;
        if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
        if (password) {
            const bcrypt = await import('bcrypt');
            updates.passwordHash = await bcrypt.default.hash(password, 10);
        }
        const user = await User.findByPk(Number(id));
        if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
        await user.update(updates);
        const json = user.toJSON() as any;
        delete json.passwordHash;
        res.json(json);
    } catch {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!['admin', 'user'].includes(role)) {
            res.status(400).json({ error: 'Rol inválido' });
            return;
        }
        await User.update({ role }, { where: { id: Number(id) } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al actualizar rol' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id: Number(id) } });
        if (!deleted) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
