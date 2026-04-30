import type { Request, Response } from 'express';
import { Game } from '../models/GameModel.js';

const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';

async function searchYoutube(query: string): Promise<string | null> {
    const ytRes = await fetch(
        `${YOUTUBE_BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YOUTUBE_KEY}`
    );
    if (!ytRes.ok) return null;
    const ytData = await ytRes.json() as any;
    const videoId = ytData.items?.[0]?.id?.videoId;
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
}

export const getGameTrailer = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!YOUTUBE_KEY) { res.status(500).json({ error: 'YOUTUBE_API_KEY no configurada' }); return; }
    try {
        const game = await Game.findOne({ where: { rawgSlug: slug } }) as any;
        if (!game) { res.status(404).json({ error: 'Juego no encontrado' }); return; }
        if (game.trailerUrl) { res.json({ trailerUrl: game.trailerUrl }); return; }

        const trailerUrl = await searchYoutube(`${game.title} official trailer`);
        if (trailerUrl) await game.update({ trailerUrl });
        res.json({ trailerUrl });
    } catch {
        res.status(500).json({ error: 'Error al obtener el trailer' });
    }
};

export const getGameplayVideo = async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (!YOUTUBE_KEY) { res.status(500).json({ error: 'YOUTUBE_API_KEY no configurada' }); return; }
    try {
        const game = await Game.findOne({ where: { rawgSlug: slug } }) as any;
        if (!game) { res.status(404).json({ error: 'Juego no encontrado' }); return; }
        if (game.gameplayUrl) { res.json({ gameplayUrl: game.gameplayUrl }); return; }

        const gameplayUrl = await searchYoutube(`${game.title} gameplay`);
        if (gameplayUrl) await game.update({ gameplayUrl });
        res.json({ gameplayUrl });
    } catch {
        res.status(500).json({ error: 'Error al obtener el gameplay' });
    }
};
