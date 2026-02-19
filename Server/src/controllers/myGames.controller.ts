import { UserGame } from '../models/UserGameModel.js';
import { Game } from '../models/GameModel.js';
import type { Request, Response } from 'express';

export const getBacklog = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ error: "Falta userId en query params" });
            return;
        }

        const backlog = await UserGame.findAll({
            where: { userId: Number(userId) },
            include: [{ model: Game }]
        });
        res.status(200).json(backlog);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener backlog" });
    }
};

export const getPriorities = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ error: "Falta userId en query params" });
            return;
        }

        const priorities = await UserGame.findAll({
            where: {
                userId: Number(userId),
                isPriority: true
            },
            include: [{ model: Game }],
            limit: 5
        });
        res.status(200).json(priorities);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener prioridades" });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const setPriority = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const markFinished = async (req: Request, res: Response) => {
    try {
        res.send('');
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const dropGame = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            res.status(400).json({ error: "Falta userId en query params" });
            return;
        }

        const deleted = await UserGame.destroy({
            where: {
                userId: userId,
                gameId: gameId
            }
        });

        if (deleted) {
            res.status(200).json({ message: "Juego eliminado de tu lista" });
        } else {
            res.status(404).json({ message: "El juego no estaba en tu lista" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar del backlog" });
    }
};