import { Collection } from '../models/CollectionModel.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import type { Request, Response } from 'express';

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.findAll();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSwipeDeck = async (req: Request, res: Response) => {
    res.send('PENDIENTE: Algoritmo de Swipe (Nivel Boss)');
};

export const getGameDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const game = await Game.findByPk(Number(id), {
            include: [
                { model: Genre },
                { model: Platform }
            ]
        });

        if (!game) {
            res.status(404).json({ message: "Juego no encontrado" });
            return;
        }

        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalles" });
    }
};

export const createGame = async (req: Request, res: Response) => {
    try {
        const newGame = await Game.create(req.body);
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ error: "Error al crear" });
    }
};

export const updateGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await Game.update(req.body, { where: { id: Number(id) } });

        if (updatedRows > 0) {
            const updatedGame = await Game.findByPk(Number(id));

            res.status(200).json(updatedGame);
        } else {
            res.status(404).json({ message: "Juego no encontrado para editar" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar juego" });
    }
};

export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedRows = await Game.destroy({ where: { id: Number(id) } });

        if (deletedRows > 0) {
            res.status(200).json({ message: "Juego eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Juego no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar juego" });
    }
};