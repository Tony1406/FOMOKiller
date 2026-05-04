import { UserGame } from '../models/UserGameModel.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import { Op } from 'sequelize';
import type { Request, Response } from 'express';

export const getBacklog = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        if (userId === undefined) {
            res.status(400).json({ error: "Falta userId en query params" });
            return;
        }

        const backlog = await UserGame.findAll({
            where: {
                userId: Number(userId),
                status: {
                    [Op.and]: [
                        { [Op.ne]: 'DROPPED' },
                        { [Op.ne]: 'DISLIKED' }
                    ]
                }
            },
            include: [{ model: Game, include: [{ model: Genre }, { model: Platform }] }],
            order: [['added_at', 'DESC']]
        });
        res.status(200).json(backlog);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener backlog" });
    }
};

export const getPriorities = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        if (userId === undefined) {
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
        const sorted = [...priorities].sort((a: any, b: any) => {
            const aOrder = a.priorityOrder ?? 999;
            const bOrder = b.priorityOrder ?? 999;
            return aOrder - bOrder;
        });
        res.status(200).json(sorted);
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

        const BACKLOG_STATUSES = ['LIKED', 'COMPLETED'];
        const userGameDef = { userId: Number(userId), gameId: Number(gameId) };
        const [userGame, created] = await UserGame.findOrCreate({
            where: userGameDef,
            defaults: { ...userGameDef, status, isPriority: false, isFinished: false, addedAt: new Date() }
        });

        if (!created) {
            const wasOut = !BACKLOG_STATUSES.includes(userGame.get('status') as string);
            const goingIn = BACKLOG_STATUSES.includes(status);
            const leavingBacklog = !BACKLOG_STATUSES.includes(status);
            const updatePayload: any = { status };
            if (wasOut && goingIn) updatePayload.addedAt = new Date();
            if (leavingBacklog) {
                updatePayload.isPriority = false;
                updatePayload.priorityOrder = null;
            }
            await userGame.update(updatePayload);
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

        let updateData: any = { isPriority };

        if (isPriority) {
            const priorityCount = await UserGame.count({
                where: { userId: Number(userId), isPriority: true }
            });
            if (priorityCount >= 5) {
                res.status(400).json({ error: "Ya tienes 5 juegos prioritarios. Elimina uno primero." });
                return;
            }
            updateData.priorityOrder = priorityCount + 1;
        } else {
            updateData.priorityOrder = null;
        }

        const [updated] = await UserGame.update(updateData, {
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

export const reorderPriorities = async (req: Request, res: Response) => {
    try {
        const { order } = req.body;
        const userId = req.query.userId;
        if (!userId || !Array.isArray(order)) {
            res.status(400).json({ error: "Faltan parámetros" });
            return;
        }
        await Promise.all(
            order.map((item: { gameId: number; priorityOrder: number }) =>
                UserGame.update(
                    { priorityOrder: item.priorityOrder },
                    { where: { userId: Number(userId), gameId: item.gameId } }
                )
            )
        );
        res.status(200).json({ message: "Orden actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al reordenar prioridades" });
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
            res.status(200).json({ message: isFinished ? "¡Juego completado!" : "Juego vuelto a pendientes" });
        } else {
            res.status(404).json({ message: "Relación no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al marcar como terminado" });
    }
};

export const clearBacklog = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ error: "Falta userId en query params" });
            return;
        }
        await UserGame.destroy({
            where: {
                userId: Number(userId),
                status: {
                    [Op.and]: [
                        { [Op.ne]: 'DROPPED' },
                        { [Op.ne]: 'DISLIKED' }
                    ]
                }
            }
        });
        res.status(200).json({ message: "Backlog borrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al limpiar el backlog" });
    }
};

