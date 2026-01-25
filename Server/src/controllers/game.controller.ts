import { Game } from '../models/GameModel.js';
import type { Request, Response } from 'express';

// GET: Obtener todos los juegos
// Mongoose: Game.find()
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.findAll();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
