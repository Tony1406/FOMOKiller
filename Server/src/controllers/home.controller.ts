import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import type { Request, Response } from 'express';

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.findAll({
            include: [{ model: Genre }, { model: Platform }]
        });
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

