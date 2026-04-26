import type { Request, Response } from 'express';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import { Collection } from '../models/CollectionModel.js';
import { CollectionGame } from '../models/CollectionGameModel.js';

export const adminGetCollections = async (_req: Request, res: Response) => {
    try {
        const collections = await Collection.findAll({ order: [['id', 'ASC']] });
        res.json(collections);
    } catch {
        res.status(500).json({ error: 'Error al obtener colecciones' });
    }
};

export const adminCreateCollection = async (req: Request, res: Response) => {
    try {
        const col = await Collection.create(req.body);
        res.status(201).json(col);
    } catch {
        res.status(500).json({ error: 'Error al crear colección' });
    }
};

export const adminUpdateCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Collection.update(req.body, { where: { id: Number(id) } });
        const updated = await Collection.findByPk(Number(id));
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Error al actualizar colección' });
    }
};

export const adminDeleteCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Collection.destroy({ where: { id: Number(id) } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar colección' });
    }
};

export const adminGetCollectionGames = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const col = await Collection.findByPk(Number(id), {
            include: [{ model: Game, include: [{ model: Genre }, { model: Platform }] }],
        });
        if (!col) { res.status(404).json({ error: 'Colección no encontrada' }); return; }
        res.json((col as any).Games ?? []);
    } catch {
        res.status(500).json({ error: 'Error al obtener juegos de la colección' });
    }
};

export const adminAddGameToCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { gameId } = req.body;
        const exists = await CollectionGame.findOne({ where: { collectionId: Number(id), gameId: Number(gameId) } });
        if (exists) { res.status(409).json({ error: 'El juego ya está en la colección' }); return; }
        await CollectionGame.create({ collectionId: Number(id), gameId: Number(gameId) });
        res.status(201).json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al añadir juego a colección' });
    }
};

export const adminRemoveGameFromCollection = async (req: Request, res: Response) => {
    try {
        const { id, gameId } = req.params;
        await CollectionGame.destroy({ where: { collectionId: Number(id), gameId: Number(gameId) } });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar juego de colección' });
    }
};
