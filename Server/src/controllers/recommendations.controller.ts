import type { Request, Response } from 'express';
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
// Los tokens deben coincidir con géneros RAWG normalizados y slugs de tags RAWG
// incluidos en el documento del juego.

const GAMETYPE_MAP: Record<string, string> = {
    action:    'action shooter fighting combat action-adventure fast-paced',
    adventure: 'adventure story-rich atmospheric narrative exploration',
    horror:    'horror survival survival-horror dark stealth',
    rpg:       'role-playing-games rpg fantasy magic medieval dark-fantasy',
    scifi:     'sci-fi futuristic cyberpunk post-apocalyptic space aliens dystopian',
    strategy:  'strategy simulation management tactical turn-based base-building',
    sports:    'sports racing',
    casual:    'casual puzzle platformer arcade relaxing',
    sandbox:   'sandbox open-world exploration crafting building',
    anime:     'anime jrpg visual-novel manga',
    any:       'action shooter fighting combat action-adventure fast-paced adventure story-rich atmospheric narrative exploration horror survival survival-horror dark stealth role-playing-games rpg fantasy magic medieval dark-fantasy sci-fi futuristic cyberpunk post-apocalyptic space aliens dystopian strategy simulation management tactical turn-based base-building sports racing casual puzzle platformer arcade relaxing sandbox open-world exploration crafting building anime jrpg visual-novel manga',
};

const SESSION_MAP: Record<string, string> = {
    short:  'short quick casual',
    medium: 'medium balanced',
    long:   'long epic immersive',
    any:    'short quick casual medium balanced long epic immersive',
};

const PLAYMODE_MAP: Record<string, string> = {
    solo:  'singleplayer story-rich atmospheric narrative',
    multi: 'multiplayer co-op online cooperative online-co-op pvp local-multiplayer',
    any:   'singleplayer story-rich atmospheric narrative multiplayer co-op online cooperative online-co-op pvp local-multiplayer',
};

// ─── GUARDAR PREFERENCIAS ─────────────────────────────────────────────────────

export const savePreferences = async (req: Request, res: Response) => {
    try {
        const userId: number = (req as any).user?.id;
        const rawBody = req.body;
        const { platforms, gameType, sessionLength, playMode, minYear, maxYear } = rawBody;

        console.log('[savePreferences] RAW body →', JSON.stringify(rawBody));
        console.log('[savePreferences] recibido →', { userId, platforms, gameType, sessionLength, playMode, minYear, maxYear });

        if (!Array.isArray(gameType) || gameType.length === 0
            || !Array.isArray(sessionLength) || sessionLength.length === 0 || !playMode) {
            console.warn('[savePreferences] validación fallida →', { gameType, sessionLength, playMode });
            res.status(400).json({ error: 'Faltan campos obligatorios', debug: { userId, gameType, sessionLength, playMode, rawBody } });
            return;
        }

        const [pref, created] = await UserPreference.findOrCreate({
            where: { userId: Number(userId) },
            defaults: {
                userId: Number(userId),
                platforms,
                gameType,
                sessionLength,
                playMode,
                ignoreHistory: false,
                minYear: minYear ?? null,
                maxYear: maxYear ?? null,
            }
        });

        if (!created) {
            await pref.update({
                platforms,
                gameType,
                sessionLength,
                playMode,
                historyResetAt: new Date(),
                minYear: minYear ?? null,
                maxYear: maxYear ?? null,
            });
        }

        await User.update(
            { hasCompletedOnboarding: true },
            { where: { id: Number(userId) } }
        );

        console.log('[savePreferences] guardado OK para userId', userId);
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
        const userId: number = (req as any).user.id;
        const explore = req.query.explore === 'true';

        const games = await Game.findAll({
            include: [
                { model: Genre, attributes: ['name'] },
                { model: Platform, attributes: ['name'] },
            ],
        });

        if (games.length === 0) { res.json([]); return; }

        const userGames = await UserGame.findAll({
            where: { userId: Number(userId), status: 'LIKED' },
        });
        const alreadySeen = new Set(userGames.map((ug: any) => String(ug.get('gameId'))));

        const unseenGames = games.filter((g: any) => !alreadySeen.has(String(g.get('id'))));

        if (explore) {
            const all = unseenGames
                .map((g: any) => g.toJSON())
                .sort(() => Math.random() - 0.5);
            res.json(all);
            return;
        }

        const pref = await UserPreference.findOne({ where: { userId: Number(userId) } });
        if (!pref) { res.status(404).json({ error: 'El usuario no ha completado el onboarding' }); return; }

        const prefData = pref.toJSON() as any;

        const expandPlatform = (p: string): string[] => {
            if (p.toLowerCase() === 'mobile') return ['ios', 'android'];
            if (p.toLowerCase() === 'playstation') return ['playstation-5', 'playstation-4'];
            return [p.toLowerCase().replace(/\s+/g, '-')];
        };

        // gameType es array; si incluye 'any' usamos todos los tokens
        const gameTypeArr: string[] = prefData.gameType ?? [];
        const gameTypeTokens = gameTypeArr.includes('any')
            ? GAMETYPE_MAP['any']
            : gameTypeArr.map((t: string) => GAMETYPE_MAP[t] ?? '').join(' ');

        // sessionLength puede ser array (nuevo) o string (legacy)
        const slRaw = prefData.sessionLength;
        const slArr: string[] = Array.isArray(slRaw) ? slRaw : (slRaw ? [slRaw] : []);
        const sessionTokens = slArr.includes('any')
            ? SESSION_MAP['any']
            : slArr.map((s: string) => SESSION_MAP[s] ?? '').join(' ');

        const userContent = [
            gameTypeTokens,
            sessionTokens,
            PLAYMODE_MAP[prefData.playMode] ?? '',
            ...(prefData.platforms ?? []).flatMap(expandPlatform),
        ].join(' ').trim();

        console.log('[getRecommendations] prefData →', { gameType: prefData.gameType, sessionLength: prefData.sessionLength, playMode: prefData.playMode, platforms: prefData.platforms });
        console.log('[getRecommendations] userContent →', userContent || '(vacío)');

        const fallbackRandom = () => {
            console.warn('[getRecommendations] fallback a orden aleatorio');
            res.json(unseenGames.map((g: any) => g.toJSON()).sort(() => Math.random() - 0.5));
        };

        if (!userContent) {
            console.warn('[getRecommendations] userContent vacío — usando fallback aleatorio');
            return fallbackRandom();
        }

        const userTokens = new Set(userContent.split(/\s+/).filter(Boolean));
        const userPlatformTokens = (prefData.platforms ?? []).flatMap(expandPlatform) as string[];
        const minYear: number | null = prefData.minYear ?? null;
        const maxYear: number | null = prefData.maxYear ?? null;

        const gameDocuments = unseenGames
            .filter((g: any) => {
                if (!minYear && !maxYear) return true;
                const year = g.get('releaseYear') as number | null;
                if (!year) return false;
                if (minYear && year < minYear) return false;
                if (maxYear && year > maxYear) return false;
                return true;
            })
            .map((g: any) => {
                const data = g.toJSON();
                const genres = (data.Genres ?? []).map((g: any) => g.name.toLowerCase().replace(/\s+/g, '-'));
                const platforms = (data.Platforms ?? []).map((p: any) => p.name.toLowerCase().replace(/\s+/g, '-'));
                const tags = (data.tags ?? '').split(',').filter(Boolean).slice(0, 12);

                const descText = (data.description ?? '').slice(0, 500).toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

                let sessionTag = '';
                if (data.playtime != null) {
                    if (data.playtime <= 10) sessionTag = 'short quick casual';
                    else if (data.playtime <= 30) sessionTag = 'medium balanced';
                    else sessionTag = 'long epic immersive';
                }

                const structuredTokens = [...genres, ...platforms, ...tags, sessionTag].filter(Boolean);
                const fullContent = `${structuredTokens.join(' ')} ${descText}`.trim();

                const onUserPlatform = userPlatformTokens.length === 0
                    || platforms.some((p: string) => userPlatformTokens.includes(p));

                const matchCount = structuredTokens.filter(t => userTokens.has(t)).length;

                return {
                    id: String(data.id),
                    content: fullContent,
                    hasMatch: onUserPlatform && matchCount >= 1,
                };
            })
            .filter(doc => doc.hasMatch && doc.content)
            .map(({ id, content }) => ({ id, content }));

        console.log(`[getRecommendations] gameDocuments tras filtro hasMatch: ${gameDocuments.length}`);

        if (gameDocuments.length === 0) {
            console.warn('[getRecommendations] 0 documentos tras filtro — fallback aleatorio');
            return fallbackRandom();
        }

        const recommender = new ContentBasedRecommender({ maxSimilarDocuments: gameDocuments.length });
        const USER_DOC_ID = `user_${userId}`;

        recommender.train([
            { id: USER_DOC_ID, content: userContent },
            ...gameDocuments,
        ]);

        const similar: { id: string; score: number }[] = recommender.getSimilarDocuments(USER_DOC_ID, 0, gameDocuments.length);

        if (!similar || similar.length === 0) {
            console.warn('[getRecommendations] getSimilarDocuments vacío — fallback aleatorio');
            return fallbackRandom();
        }

        const gameMap = new Map(games.map((g: any) => [String(g.get('id')), g.toJSON()]));

        const recommendations = similar
            .map(({ id, score }) => ({
                ...gameMap.get(id),
                recommendationScore: Math.round(score * 100) / 100,
            }))
            .filter(r => r.id !== undefined)
            .sort(() => Math.random() - 0.5);

        console.log(`[getRecommendations] enviando ${recommendations.length} recomendaciones`);
        res.json(recommendations);
    } catch (err: any) {
        console.error('[getRecommendations] excepción:', err?.message ?? err);
        res.status(500).json({ error: 'Error al generar recomendaciones', detail: err?.message ?? String(err) });
    }
};
