import type { Request, Response } from 'express';

const RAWG_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE = 'https://api.rawg.io/api';

export const getGameDetails = async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!RAWG_KEY) {
        res.status(500).json({ error: 'RAWG_API_KEY no configurada' });
        return;
    }

    try {
        const [detailRes, screenshotsRes] = await Promise.all([
            fetch(`${RAWG_BASE}/games/${slug}?key=${RAWG_KEY}`),
            fetch(`${RAWG_BASE}/games/${slug}/screenshots?key=${RAWG_KEY}`)
        ]);

        if (!detailRes.ok) {
            res.status(detailRes.status).json({ error: 'Juego no encontrado en RAWG' });
            return;
        }

        const detail = await detailRes.json() as any;
        const screenshots = screenshotsRes.ok ? await screenshotsRes.json() as any : { results: [] };

        res.json({
            description: detail.description_raw ?? null,
            developer: detail.developers?.[0]?.name ?? null,
            publisher: detail.publishers?.[0]?.name ?? null,
            esrb: detail.esrb_rating?.name ?? null,
            website: detail.website ?? null,
            trailer: detail.clip?.clip ?? null,
            screenshots: (screenshots.results ?? []).map((s: any) => s.image),
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al contactar RAWG' });
    }
};
