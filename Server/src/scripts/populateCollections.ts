import dotenv from 'dotenv';
import { sequelize } from '../config/db.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { defineAssociations } from '../models/associations.js';

dotenv.config();

const MYSQL = sequelize;

async function clearAndPopulate(collectionId: number, gameIds: number[]) {
    await MYSQL.query(`DELETE FROM collection_games WHERE collection_id = ${collectionId}`);
    if (gameIds.length === 0) return;
    const values = gameIds.map(gid => `(${collectionId}, ${gid})`).join(', ');
    await MYSQL.query(`INSERT IGNORE INTO collection_games (collection_id, game_id) VALUES ${values}`);
    console.log(`  Colección ${collectionId}: ${gameIds.length} juegos`);
}

function hasTags(tags: string, keywords: string[]): boolean {
    if (!tags) return false;
    return keywords.some(kw => tags.includes(kw));
}

async function main() {
    defineAssociations();
    await MYSQL.sync();
    console.log('DB lista\n');

    const games = await Game.findAll({
        include: [{ model: Genre }],
        attributes: ['id', 'title', 'tags', 'releaseYear', 'playtime'],
    });

    // ── 1. GOTYs ─────────────────────────────────────────────────────────────
    // Juegos con tags de GOTY o considerados "masterpiece"
    const gotyTags = ['goty', 'game-of-the-year', 'masterpiece', 'top-rated', 'hall-of-fame', 'greatest'];
    const gotyTitles = [
        'the witcher', 'red dead redemption', 'god of war', 'elden ring', 'the last of us',
        'breath of the wild', 'sekiro', 'disco elysium', 'hades', 'hollow knight',
        'persona 5', 'mass effect', 'dark souls', 'bioshock', 'portal',
        'half-life', 'shadow of the colossus', 'metal gear solid', 'resident evil',
        'baldur', 'cyberpunk 2077', 'batman arkham', 'undertale', 'minecraft',
        'grand theft auto', 'super mario', 'zelda', 'final fantasy', 'bloodborne',
        'death stranding', 'horizon', 'ghost of tsushima', 'celeste', 'ori and',
        'what remains of edith finch', 'outer wilds', 'return of the obra dinn',
    ];
    const gotyIds = games
        .filter((g: any) => {
            const title = g.get('title')?.toLowerCase() ?? '';
            const tags = g.get('tags') ?? '';
            return hasTags(tags, gotyTags) || gotyTitles.some(t => title.includes(t));
        })
        .map((g: any) => g.get('id') as number);

    // ── 2. Indies ─────────────────────────────────────────────────────────────
    const indieGenreIds = games
        .filter((g: any) => {
            const genres = (g as any).Genres?.map((gr: any) => gr.name) ?? [];
            const tags = g.get('tags') ?? '';
            return genres.includes('Indie') || hasTags(tags, ['indie', 'pixel-graphics', 'pixel-art', '8-bit', '16-bit', 'hand-drawn', 'lo-fi']);
        })
        .map((g: any) => g.get('id') as number);

    // ── 3. Retro ──────────────────────────────────────────────────────────────
    const retroIds = games
        .filter((g: any) => {
            const year = g.get('releaseYear') as number | null;
            const tags = g.get('tags') ?? '';
            return (year && year <= 2000) || hasTags(tags, ['retro', 'classic', '8-bit', '16-bit', 'pixel-graphics', 'old-school', 'nostalgic', 'arcade', 'atari', 'nes', 'snes', 'gameboy']);
        })
        .map((g: any) => g.get('id') as number);

    // ── 4. Graficazos ─────────────────────────────────────────────────────────
    const graficazosKeywords = [
        'beautiful', 'cinematic', 'atmospheric', 'stunning', 'gorgeous',
        'photorealistic', 'ray-tracing', 'realistic', 'next-gen', 'visuals',
        'epic', 'immersive', 'open-world',
    ];
    const graficazosTitles = [
        'red dead redemption', 'cyberpunk', 'god of war', 'horizon', 'ghost of tsushima',
        'the witcher 3', 'death stranding', 'control', 'metro', 'crysis',
        'assassin\'s creed', 'shadow of the tomb', 'kingdom come', 'forza',
        'microsoft flight', 'star wars battlefront', 'call of duty', 'battlefield',
        'the last of us', 'detroit', 'heavy rain', 'beyond two souls',
    ];
    const graficazosIds = games
        .filter((g: any) => {
            const title = g.get('title')?.toLowerCase() ?? '';
            const tags = g.get('tags') ?? '';
            const year = g.get('releaseYear') as number | null;
            return hasTags(tags, graficazosKeywords)
                || graficazosTitles.some(t => title.includes(t))
                || (year && year >= 2020 && hasTags(tags, ['singleplayer', 'atmospheric', 'open-world']));
        })
        .map((g: any) => g.get('id') as number);

    // ── 5. Gemas ocultas ──────────────────────────────────────────────────────
    const gemasKeywords = ['hidden-gem', 'underrated', 'overlooked', 'cult-classic', 'cult classic', 'unique', 'experimental', 'niche'];
    const gemasExcludeFamousTitles = [
        'witcher', 'elden ring', 'god of war', 'red dead', 'last of us',
        'cyberpunk', 'grand theft auto', 'minecraft', 'fortnite', 'call of duty',
        'battlefield', 'assassin\'s creed', 'zelda', 'mario', 'pokemon',
    ];
    const gemasIds = games
        .filter((g: any) => {
            const title = g.get('title')?.toLowerCase() ?? '';
            const tags = g.get('tags') ?? '';
            const isFamous = gemasExcludeFamousTitles.some(t => title.includes(t));
            if (isFamous) return false;
            return hasTags(tags, gemasKeywords)
                || hasTags(tags, ['indie', 'pixel-graphics']) && !hasTags(tags, ['popular', 'trending']);
        })
        .map((g: any) => g.get('id') as number);

    // ── 6. Rompemandos ────────────────────────────────────────────────────────
    const rompeKeywords = [
        'difficult', 'challenging', 'souls-like', 'soulslike', 'soulsborne',
        'hard', 'hardcore', 'permadeath', 'roguelite', 'roguelike',
        'dark-souls', 'punishing', 'unforgiving', 'boss-rush', 'precision-platformer',
        'bullet-hell', 'intense', 'brutal', 'masochistic',
    ];
    const rompeTitles = [
        'dark souls', 'elden ring', 'bloodborne', 'sekiro', 'nioh',
        'hollow knight', 'celeste', 'cuphead', 'super meat boy', 'battletoads',
        'ghosts \'n goblins', 'demon\'s souls', 'returnal', 'hades',
        'dead cells', 'enter the gungeon', 'binding of isaac', 'risk of rain',
        'salt and sanctuary', 'mortal kombat', 'guilty gear', 'monster hunter',
    ];
    const rompeIds = games
        .filter((g: any) => {
            const title = g.get('title')?.toLowerCase() ?? '';
            const tags = g.get('tags') ?? '';
            return hasTags(tags, rompeKeywords) || rompeTitles.some(t => title.includes(t));
        })
        .map((g: any) => g.get('id') as number);

    console.log('Poblando colecciones...');
    await clearAndPopulate(1, gotyIds);
    await clearAndPopulate(2, indieGenreIds);
    await clearAndPopulate(3, retroIds);
    await clearAndPopulate(4, graficazosIds);
    await clearAndPopulate(5, gemasIds);
    await clearAndPopulate(6, rompeIds);

    console.log('\nHecho.');
    await MYSQL.close();
}

main().catch(err => { console.error(err); process.exit(1); });
