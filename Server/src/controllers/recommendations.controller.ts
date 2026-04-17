import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from '../models/UserModel.js';
import { UserPreference } from '../models/UserPreferenceModel.js';
import { UserGame } from '../models/UserGameModel.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';

// @ts-ignore — la librería no tiene tipos oficiales
import ContentBasedRecommender from 'content-based-recommender';

// ─── MAPEO: respuestas del wizard → vocabulario de géneros ────────────────────
//
// El recomendador trabaja con similitud de texto (TF-IDF + coseno).
// Convertimos tanto los juegos como el perfil del usuario en strings de texto
// con el mismo vocabulario. La librería mide cuánto se parecen esos strings.

// IMPORTANTE: los tokens deben coincidir con:
//   - géneros RAWG normalizados: g.name.toLowerCase().replace(/\s+/g, '-')
//     ej. "Role-playing Games" → "role-playing-games", "Indie" → "indie"
//   - slugs de tags RAWG incluidos en el documento del juego
//     ej. "rpg", "survival", "horror", "sandbox", "roguelike", "open-world"

const FEELING_MAP: Record<string, string> = {
    tension:    'action shooter fighting survival horror',
    story:      'adventure role-playing-games rpg indie story-rich',
    relax:      'casual simulation puzzle platformer',
    adrenaline: 'shooter racing sports action fighting',
    build:      'strategy simulation indie sandbox',
};

const WORLD_MAP: Record<string, string> = {
    fantasy:    'role-playing-games rpg adventure action fantasy open-world',
    scifi:      'shooter strategy adventure science-fiction',
    horror:     'action adventure indie horror survival',
    openworld:  'adventure role-playing-games rpg simulation open-world sandbox',
    realism:    'sports simulation adventure realistic',
};

const DEPTH_MAP: Record<string, string> = {
    casual:    'casual puzzle platformer arcade indie',
    complex:   'strategy role-playing-games rpg simulation management',
    narrative: 'adventure indie role-playing-games rpg story-rich',
    challenge: 'action shooter fighting roguelike',
};

const SESSION_MAP: Record<string, string> = {
    short:  'short quick casual',
    medium: 'medium balanced',
    long:   'long epic immersive role-playing-games rpg strategy simulation',
};

// ─── GUARDAR PREFERENCIAS ─────────────────────────────────────────────────────

export const savePreferences = async (req: Request, res: Response) => {
    try {
        const { userId, platforms, sessionLength, feeling, worldType, depth, minYear, maxYear } = req.body;

        if (!userId || !sessionLength || !feeling || !worldType || !depth) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        const [pref, created] = await UserPreference.findOrCreate({
            where: { userId: Number(userId) },
            defaults: { userId: Number(userId), platforms, sessionLength, feeling, worldType, depth, ignoreHistory: false, minYear: minYear ?? null, maxYear: maxYear ?? null }
        });

        if (!created) {
            await pref.update({ platforms, sessionLength, feeling, worldType, depth, historyResetAt: new Date(), minYear: minYear ?? null, maxYear: maxYear ?? null });
        }

        await User.update(
            { hasCompletedOnboarding: true },
            { where: { id: Number(userId) } }
        );

        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar preferencias' });
    }
};

// ─── OBTENER PREFERENCIAS ─────────────────────────────────────────────────────

export const getPreferences = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const pref = await UserPreference.findOne({ where: { userId: Number(userId) } });
        if (!pref) { res.status(404).json({ error: 'Sin preferencias' }); return; }
        res.json(pref);
    } catch {
        res.status(500).json({ error: 'Error al obtener preferencias' });
    }
};

// ─── TOGGLE MODO EXPLORACIÓN ──────────────────────────────────────────────────

export const toggleIgnoreHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const pref = await UserPreference.findOne({ where: { userId: Number(userId) } });
        if (!pref) { res.status(404).json({ error: 'Sin preferencias' }); return; }
        const newVal = !(pref.get('ignoreHistory') as boolean);
        await pref.update({ ignoreHistory: newVal });
        res.json({ ignoreHistory: newVal });
    } catch {
        res.status(500).json({ error: 'Error al cambiar modo exploración' });
    }
};

// ─── RESET HISTORIAL ──────────────────────────────────────────────────────────
// No borra los likes del backlog — solo activa ignoreHistory permanentemente
// hasta que el usuario lo desactive o rehaga el onboarding.

export const resetHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const pref = await UserPreference.findOne({ where: { userId: Number(userId) } });
        if (!pref) { res.status(404).json({ error: 'Sin preferencias' }); return; }
        await pref.update({ historyResetAt: new Date(), ignoreHistory: false });
        res.json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Error al resetear historial' });
    }
};

// ─── OBTENER RECOMENDACIONES ──────────────────────────────────────────────────

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // 1. Buscar preferencias del usuario
        const pref = await UserPreference.findOne({ where: { userId: Number(userId) } });
        if (!pref) { res.status(404).json({ error: 'El usuario no ha completado el onboarding' }); return; }

        const prefData = pref.toJSON() as any;

        // 2. Construir string de perfil base desde el onboarding
        const onboardingContent = [
            FEELING_MAP[prefData.feeling] ?? '',
            WORLD_MAP[prefData.worldType] ?? '',
            DEPTH_MAP[prefData.depth] ?? '',
            SESSION_MAP[prefData.sessionLength] ?? '',
            ...(prefData.platforms ?? []).map((p: string) => p.toLowerCase().replace(/\s+/g, '-')),
        ].join(' ').trim();

        // 3. Si ignoreHistory es false, enriquecer el perfil con los juegos que dio LIKE
        //    Las palabras de géneros repetidas tienen más peso en TF-IDF automáticamente
        let userContent = onboardingContent;

        if (!prefData.ignoreHistory) {
            const likedWhere: any = { userId: Number(userId), status: 'LIKED' };
            if (prefData.historyResetAt) {
                likedWhere.updatedAt = { [Op.gte]: new Date(prefData.historyResetAt) };
            }
            const likedGames = await UserGame.findAll({
                where: likedWhere,
                include: [{ model: Game, include: [{ model: Genre }, { model: Platform }] }],
            });

            if (likedGames.length > 0) {
                const likedContent = likedGames.map((ug: any) => {
                    const game = ug.Game;
                    if (!game) return '';
                    const genres = (game.Genres ?? []).map((g: any) => g.name.toLowerCase().replace(/\s+/g, '-'));
                    const platforms = (game.Platforms ?? []).map((p: any) => p.name.toLowerCase().replace(/\s+/g, '-'));
                    return [...genres, ...platforms].join(' ');
                }).join(' ');

                // Concatenamos onboarding + likes: las palabras que más se repiten
                // en los likes pesan más automáticamente gracias a TF-IDF
                userContent = `${onboardingContent} ${likedContent}`.trim();
            }
        }

        // 4. Obtener todos los juegos con géneros y plataformas
        const games = await Game.findAll({
            include: [
                { model: Genre, attributes: ['name'] },
                { model: Platform, attributes: ['name'] },
            ],
        });

        if (games.length === 0) { res.json([]); return; }

        // 5. Obtener IDs de juegos que el usuario ya tiene en su backlog (excluirlos)
        const userGames = await UserGame.findAll({ where: { userId: Number(userId) } });
        const alreadyInBacklog = new Set(userGames.map((ug: any) => String(ug.get('gameId'))));

        // 6. Convertir cada juego en un documento de texto y pre-filtrar por relevancia
        // Con 5000+ juegos, entrenar TF-IDF sobre todos es muy lento.
        // Un juego con cero tokens en común con el perfil tendría score 0 de todas formas,
        // así que podemos excluirlos sin afectar los resultados.
        const userTokens = new Set(userContent.split(/\s+/).filter(Boolean));

        // Filtro duro de plataforma: si el usuario especificó plataformas,
        // excluir juegos que no estén disponibles en ninguna de ellas.
        const userPlatformTokens = (prefData.platforms ?? [])
            .map((p: string) => p.toLowerCase().replace(/\s+/g, '-')) as string[];

        // Filtro duro de año: si el usuario eligió un rango, excluir juegos fuera de él.
        const minYear: number | null = prefData.minYear ?? null;
        const maxYear: number | null = prefData.maxYear ?? null;

        const gameDocuments = games
            .filter((g: any) => !alreadyInBacklog.has(String(g.get('id'))))
            .filter((g: any) => {
                if (!minYear && !maxYear) return true;
                const year = g.get('releaseYear') as number | null;
                if (!year) return true; // sin año de lanzamiento → no excluir
                if (minYear && year < minYear) return false;
                if (maxYear && year > maxYear) return false;
                return true;
            })
            .map((g: any) => {
                const data = g.toJSON();
                const genres = (data.Genres ?? []).map((g: any) => g.name.toLowerCase().replace(/\s+/g, '-'));
                const platforms = (data.Platforms ?? []).map((p: any) => p.name.toLowerCase().replace(/\s+/g, '-'));
                // Incluir los primeros 12 tags (slugs de RAWG): "rpg", "survival", "horror", "sandbox"…
                // Son slugs ya normalizados (minúsculas, guiones) que coinciden con el vocabulario de los mapas
                const tags = (data.tags ?? '').split(',').filter(Boolean).slice(0, 12);

                let sessionTag = '';
                if (data.playtime != null) {
                    if (data.playtime <= 10) sessionTag = 'short quick casual';
                    else if (data.playtime <= 30) sessionTag = 'medium balanced';
                    else sessionTag = 'long epic immersive';
                }

                const allTokens = [...genres, ...platforms, ...tags, sessionTag].filter(Boolean);

                // Filtro duro: el juego debe estar en al menos una plataforma del usuario
                const onUserPlatform = userPlatformTokens.length === 0
                    || platforms.some((p: string) => userPlatformTokens.includes(p));

                return {
                    id: String(data.id),
                    content: allTokens.join(' ').trim(),
                    hasMatch: onUserPlatform && allTokens.some(t => userTokens.has(t)),
                };
            })
            .filter(doc => doc.hasMatch && doc.content)
            // Limitar a 800 candidatos para garantizar tiempo de respuesta razonable
            .slice(0, 800)
            .map(({ id, content }) => ({ id, content }));

        if (gameDocuments.length === 0) { res.json([]); return; }

        // 7. Entrenar el recomendador con todos los documentos (perfil + juegos)
        const recommender = new ContentBasedRecommender({ maxSimilarDocuments: gameDocuments.length });
        const USER_DOC_ID = `user_${userId}`;

        recommender.train([
            { id: USER_DOC_ID, content: userContent },
            ...gameDocuments,
        ]);

        // 8. Obtener los juegos más similares al perfil del usuario
        const similar: { id: string; score: number }[] = recommender.getSimilarDocuments(USER_DOC_ID, 0, 30);

        if (!similar || similar.length === 0) { res.json([]); return; }

        // 9. Devolver los juegos ordenados por score de recomendación
        const gameMap = new Map(games.map((g: any) => [String(g.get('id')), g.toJSON()]));

        const recommendations = similar
            .map(({ id, score }) => ({
                ...gameMap.get(id),
                recommendationScore: Math.round(score * 100) / 100,
            }))
            .filter(r => r.id !== undefined);

        res.json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al generar recomendaciones' });
    }
};
