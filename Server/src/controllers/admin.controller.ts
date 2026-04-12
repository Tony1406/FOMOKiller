import type { Request, Response } from 'express';
import { User } from '../models/UserModel.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import { Collection } from '../models/CollectionModel.js';
import { CollectionGame } from '../models/CollectionGameModel.js';

const RAWG_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE = 'https://api.rawg.io/api';

// ─── USUARIOS ────────────────────────────────────────────────────────────────

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
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }
        const existing = await User.findOne({ where: { email } });
        if (existing) { res.status(409).json({ error: 'Ya existe un usuario con ese email' }); return; }
        const bcrypt = await import('bcrypt');
        const passwordHash = await bcrypt.default.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: role || 'user' });
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
        const { username, email, role, password } = req.body;
        if (role && !['admin', 'user'].includes(role)) {
            res.status(400).json({ error: 'Rol inválido' });
            return;
        }
        const updates: any = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (password) {
            const bcrypt = await import('bcrypt');
            updates.passwordHash = await bcrypt.default.hash(password, 10);
        }
        await User.update(updates, { where: { id: Number(id) } });
        const updated = await User.findByPk(Number(id), { attributes: { exclude: ['passwordHash'] } });
        res.json(updated);
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

// ─── JUEGOS ──────────────────────────────────────────────────────────────────

export const adminGetAllGames = async (_req: Request, res: Response) => {
    try {
        const games = await Game.findAll({
            include: [{ model: Genre }, { model: Platform }],
            order: [['title', 'ASC']],
        });
        res.json(games);
    } catch {
        res.status(500).json({ error: 'Error al obtener juegos' });
    }
};

export const adminGetPlatforms = async (_req: Request, res: Response) => {
    try {
        const platforms = await Platform.findAll({ order: [['name', 'ASC']] });
        res.json(platforms);
    } catch {
        res.status(500).json({ error: 'Error al obtener plataformas' });
    }
};

export const adminCreateGame = async (req: Request, res: Response) => {
    try {
        const { platformIds, ...gameData } = req.body;
        const game = await Game.create(gameData);
        if (Array.isArray(platformIds) && platformIds.length > 0) {
            const platforms = await Platform.findAll({ where: { id: platformIds } });
            for (const platform of platforms) {
                await (game as any).addPlatform(platform);
            }
        }
        res.status(201).json(game);
    } catch {
        res.status(500).json({ error: 'Error al crear juego' });
    }
};

export const adminUpdateGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { platformIds, ...gameData } = req.body;
        const [rows] = await Game.update(gameData, { where: { id: Number(id) } });
        if (!rows) { res.status(404).json({ error: 'Juego no encontrado' }); return; }
        if (Array.isArray(platformIds)) {
            const game = await Game.findByPk(Number(id));
            if (game) {
                await (game as any).setPlatforms([]);
                const platforms = await Platform.findAll({ where: { id: platformIds } });
                for (const platform of platforms) {
                    await (game as any).addPlatform(platform);
                }
            }
        }
        const updated = await Game.findByPk(Number(id), { include: [{ model: Genre }, { model: Platform }] });
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Error al actualizar juego' });
    }
};

export const adminDeleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Game.destroy({ where: { id: Number(id) } });
        if (!deleted) { res.status(404).json({ error: 'Juego no encontrado' }); return; }
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al eliminar juego' });
    }
};

// ─── RAWG SEARCH + IMPORT ────────────────────────────────────────────────────

export const searchRawg = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const page = Number(req.query.page) || 1;
    if (!q || !RAWG_KEY) { res.status(400).json({ error: 'Parámetros inválidos' }); return; }
    try {
        const r = await fetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(q)}&page_size=12&page=${page}`);
        const data = await r.json() as any;
        const results = (data.results ?? []).map((g: any) => ({
            rawgId: g.id,
            rawgSlug: g.slug,
            title: g.name,
            releaseYear: g.released ? Number(g.released.split('-')[0]) : null,
            imageUrl: g.background_image ?? null,
            platforms: (g.platforms ?? []).map((p: any) => p.platform.name),
            genres: (g.genres ?? []).map((g: any) => g.name),
        }));
        res.json({ results, hasMore: !!data.next });
    } catch {
        res.status(500).json({ error: 'Error al buscar en RAWG' });
    }
};

export const importFromRawg = async (req: Request, res: Response) => {
    const { rawgSlug } = req.body;
    if (!rawgSlug || !RAWG_KEY) { res.status(400).json({ error: 'Faltan datos' }); return; }

    try {
        const existing = await Game.findOne({ where: { rawgSlug } });
        if (existing) { res.status(409).json({ error: 'El juego ya existe', game: existing }); return; }

        const [detailRes] = await Promise.all([
            fetch(`${RAWG_BASE}/games/${rawgSlug}?key=${RAWG_KEY}`),
            fetch(`${RAWG_BASE}/games/${rawgSlug}/screenshots?key=${RAWG_KEY}`),
        ]);

        if (!detailRes.ok) { res.status(404).json({ error: 'Juego no encontrado en RAWG' }); return; }
        const detail = await detailRes.json() as any;

        const game = await Game.create({
            title: detail.name,
            description: detail.description_raw ?? null,
            releaseYear: detail.released ? Number(detail.released.split('-')[0]) : null,
            developer: detail.developers?.[0]?.name ?? null,
            imageUrl: detail.background_image ?? null,
            rawgId: detail.id,
            rawgSlug: detail.slug,
            playtime: detail.playtime ?? null,
        });

        // Géneros
        for (const g of (detail.genres ?? [])) {
            const [genre] = await Genre.findOrCreate({ where: { name: g.name } });
            await (game as any).addGenre(genre);
        }

        // Plataformas
        for (const p of (detail.platforms ?? [])) {
            const [platform] = await Platform.findOrCreate({ where: { name: p.platform.name } });
            await (game as any).addPlatform(platform);
        }

        res.status(201).json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al importar juego' });
    }
};

// ─── COLECCIONES ─────────────────────────────────────────────────────────────

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
