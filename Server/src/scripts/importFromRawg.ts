import dotenv from 'dotenv';
import { sequelize } from '../config/db.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import { GameGenre } from '../models/GameGenreModel.js';
import { GamePlatform } from '../models/GamePlatformModel.js';
import { defineAssociations } from '../models/associations.js';

dotenv.config();

const RAWG_KEY = process.env.RAWG_API_KEY;
const TOTAL_PAGES = 25; // 25 páginas × 20 juegos = 500 juegos
const DELAY_MS = 350;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    if (!RAWG_KEY) {
        console.error(' RAWG_API_KEY no encontrada en .env');
        process.exit(1);
    }

    defineAssociations();
    await sequelize.sync({ alter: true });
    console.log(' Base de datos lista');

    let totalImportados = 0;
    let paginasVacias = 0;

    for (let page = 1; page <= TOTAL_PAGES; page++) {
        const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&page=${page}&page_size=20&ordering=-rating`;

        let data: any;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Error en página ${page}: ${res.status}`);
                await sleep(DELAY_MS);
                continue;
            }
            data = await res.json();
        } catch (err) {
            console.error(`Error de red en página ${page}:`, err);
            await sleep(DELAY_MS);
            continue;
        }

        if (!data.results?.length) {
            paginasVacias++;
            if (paginasVacias >= 3) break;
            continue;
        }
        paginasVacias = 0;

        for (const rawGame of data.results) {
            if (!rawGame.background_image) continue;

            const releaseYear = rawGame.released
                ? parseInt(rawGame.released.split('-')[0])
                : null;

            const tags = (rawGame.tags ?? [])
                .map((t: any) => t.slug)
                .join(',');

            const playtime = rawGame.playtime ?? null;

            const [game, created] = await (Game as any).findOrCreate({
                where: { rawgId: rawGame.id },
                defaults: {
                    rawgId: rawGame.id,
                    rawgSlug: rawGame.slug,
                    title: rawGame.name,
                    imageUrl: rawGame.background_image,
                    releaseYear,
                    tags,
                    playtime,
                }
            });

            if (!created) {
                await game.update({
                    rawgSlug: rawGame.slug,
                    title: rawGame.name,
                    imageUrl: rawGame.background_image,
                    releaseYear,
                    tags,
                    playtime,
                });
            }

            const gameId = (game as any).id;

            for (const g of rawGame.genres ?? []) {
                const [genre] = await (Genre as any).findOrCreate({ where: { name: g.name } });
                await (GameGenre as any).findOrCreate({
                    where: { gameId, genreId: (genre as any).id }
                });
            }

            for (const p of rawGame.platforms ?? []) {
                const [platform] = await (Platform as any).findOrCreate({
                    where: { name: p.platform.name }
                });
                await (GamePlatform as any).findOrCreate({
                    where: { gameId, platformId: (platform as any).id }
                });
            }

            totalImportados++;
        }

        console.log(`Página ${page}/${TOTAL_PAGES} — ${totalImportados} juegos importados`);
        await sleep(DELAY_MS);
    }

    console.log(`\n Importación completada: ${totalImportados} juegos en total`);
    await sequelize.close();
}

main().catch(err => {
    console.error(' Error fatal:', err);
    process.exit(1);
});
