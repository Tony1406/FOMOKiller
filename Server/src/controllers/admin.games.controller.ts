import type { Request, Response } from 'express';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';

const RAWG_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE = 'https://api.rawg.io/api';

const ADULT_TAGS = new Set([
    'adult', 'adults-only', 'nudity', 'sexual-content', 'hentai',
    'eroge', 'nsfw', 'pornographic', 'sexual', 'explicit-content',
    'adult-content', 'mature-content', '18+', 'ecchi',
]);

const isAdultContent = (game: any): boolean => {
    if (game.esrb_rating?.slug === 'adults-only') return true;
    const tags: string[] = (game.tags ?? []).map((t: any) => t.slug as string);
    return tags.some(t => ADULT_TAGS.has(t));
};

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

export const searchRawg = async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const page = Number(req.query.page) || 1;
    if (!q || !RAWG_KEY) { res.status(400).json({ error: 'Parámetros inválidos' }); return; }
    try {
        const r = await fetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(q)}&page_size=12&page=${page}`);
        const data = await r.json() as any;
        const results = (data.results ?? []).filter((g: any) => !isAdultContent(g)).map((g: any) => ({
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

        if (isAdultContent(detail)) {
            res.status(422).json({ error: 'Contenido adulto no permitido' });
            return;
        }

        const tags = (detail.tags ?? [])
            .map((t: any) => t.slug as string)
            .filter(Boolean)
            .join(',');

        const game = await Game.create({
            title: detail.name,
            description: detail.description_raw ?? null,
            releaseYear: detail.released ? Number(detail.released.split('-')[0]) : null,
            developer: detail.developers?.[0]?.name ?? null,
            imageUrl: detail.background_image ?? null,
            rawgId: detail.id,
            rawgSlug: detail.slug,
            playtime: detail.playtime ?? null,
            tags: tags || null,
        });

        for (const g of (detail.genres ?? [])) {
            const [genre] = await Genre.findOrCreate({ where: { name: g.name } });
            await (game as any).addGenre(genre);
        }

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
