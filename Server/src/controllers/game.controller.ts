import type { Request, Response } from 'express';
import { GameModel } from '../models/GameModel.js';

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await GameModel.findAll();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};