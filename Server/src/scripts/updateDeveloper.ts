import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Game } from '../models/GameModel.js';

dotenv.config();

const RAWG_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE = 'https://api.rawg.io/api';
const DELAY_MS = 350;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    if (!RAWG_KEY) {
        console.error('RAWG_API_KEY no encontrada en .env');
        process.exit(1);
    }

    await sequelize.sync();
    console.log('Base de datos lista');

    const games = await (Game as any).findAll({
        where: {
            developer: null,
            rawgSlug: { [Op.not]: null },
        },
        attributes: ['id', 'rawgSlug'],
    });

    console.log(`${games.length} juegos sin developer — empezando...`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const slug = (game as any).rawgSlug;

        try {
            const res = await fetch(`${RAWG_BASE}/games/${slug}?key=${RAWG_KEY}`);
            if (!res.ok) {
                errors++;
                await sleep(DELAY_MS);
                continue;
            }

            const detail = await res.json() as any;
            const developer = detail.developers?.[0]?.name ?? null;

            if (developer) {
                await game.update({ developer });
                updated++;
            } else {
                skipped++;
            }
        } catch {
            errors++;
        }

        if ((i + 1) % 100 === 0) {
            console.log(`  ${i + 1}/${games.length} — ${updated} actualizados, ${skipped} sin developer, ${errors} errores`);
        }

        await sleep(DELAY_MS);
    }

    console.log(`\n Completado: ${updated} developers actualizados, ${skipped} sin developer en RAWG, ${errors} errores`);
    await sequelize.close();
}

main().catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});
