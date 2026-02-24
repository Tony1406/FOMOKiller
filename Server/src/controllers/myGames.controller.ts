import { UserGame } from '../models/UserGameModel.js';
import { Game } from '../models/GameModel.js';
import { Op } from 'sequelize';
import type { Request, Response } from 'express';

export const getBacklog = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ error: "Falta userId en query params" });
            return;
        }

        const backlog = await UserGame.findAll({
            where: {
                userId: Number(userId),
                status: {
                    [Op.ne]: 'DROPPED'
                }
            },
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
        const { gameId, status } = req.body;
        const userId = req.query.userId;

        if (!userId || !gameId || !status) {
            res.status(400).json({ error: "Faltan parámetros (userId en query, gameId y status en body)" });
            return;
        }

        const userGameDef = { userId: Number(userId), gameId: Number(gameId) };
        const [userGame, created] = await UserGame.findOrCreate({
            where: userGameDef,
            defaults: { ...userGameDef, status, isPriority: false, isFinished: false }
        });

        if (!created) {
            await userGame.update({ status });
        }

        res.status(200).json({ message: "Estado guardado o actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado" });
    }
};

export const setPriority = async (req: Request, res: Response) => {
    try {
        const { gameId, isPriority } = req.body;
        const userId = req.query.userId;

        if (!userId || !gameId) {
            res.status(400).json({ error: "Faltan parámetros (userId en query, gameId en body)" });
            return;
        }

        if (isPriority) {
            const priorityCount = await UserGame.count({
                where: { userId: Number(userId), isPriority: true }
            });
            if (priorityCount >= 5) {
                res.status(400).json({ error: "Ya tienes 5 juegos prioritarios. Elimina uno primero." });
                return;
            }
        }

        const [updated] = await UserGame.update({ isPriority }, {
            where: { userId: Number(userId), gameId: Number(gameId) }
        });

        if (updated) {
            res.status(200).json({ message: "Prioridad actualizada" });
        } else {
            res.status(404).json({ message: "Juego no encontrado en tu lista" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la prioridad" });
    }
};

export const markFinished = async (req: Request, res: Response) => {
    try {
        const { gameId, isFinished } = req.body;
        const userId = req.query.userId;

        if (!userId || !gameId) {
            res.status(400).json({ error: "Faltan parámetros (userId en query, gameId en body)" });
            return;
        }

        const [updated] = await UserGame.update({ isFinished }, {
            where: { userId: Number(userId), gameId: Number(gameId) }
        });

        if (updated) {
            res.status(200).json({ message: isFinished ? "¡Juego completado! 🎉" : "Juego vuelto a pendientes" });
        } else {
            res.status(404).json({ message: "Relación no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al marcar como terminado" });
    }
};

export const checkIsPriority = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const userId = req.query.userId;

        if (!userId || !gameId) {
            res.status(400).json({ error: "Faltan parámetros (userId en query, gameId en params)" });
            return;
        }

        const userGame = await UserGame.findOne({
            where: { userId: Number(userId), gameId: Number(gameId) }
        });

        if (userGame) {
            res.status(200).json({ isPriority: (userGame as any).isPriority });
        } else {
            res.status(404).json({ message: "Juego no encontrado en tu lista" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al verificar prioridad" });
    }
};

export const checkIsFinished = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const userId = req.query.userId;

        if (!userId || !gameId) {
            res.status(400).json({ error: "Faltan parámetros (userId en query, gameId en params)" });
            return;
        }

        const userGame = await UserGame.findOne({
            where: { userId: Number(userId), gameId: Number(gameId) }
        });

        if (userGame) {
            res.status(200).json({ isFinished: (userGame as any).isFinished });
        } else {
            res.status(404).json({ message: "Juego no encontrado en tu lista" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al verificar completado" });
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
                userId: Number(userId),
                gameId: Number(gameId)
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