import { Collection } from '../models/CollectionModel.js';
import { Game } from '../models/GameModel.js';
import { Genre } from '../models/GenreModel.js';
import { Platform } from '../models/PlatformModel.js';
import { Op } from 'sequelize';
import type { Request, Response } from 'express';

export const getCollections = async (req: Request, res: Response) => {
    try {
        const collections = await Collection.findAll({
            include: [
                {
                    model: Game,
                    attributes: ['id'],
                    through: { attributes: [] }
                }
            ]
        });

        const formatted = collections.map((col: any) => {
            const data = col.toJSON();
            data.gameCount = data.Games ? data.Games.length : 0;
            delete data.Games;
            return data;
        });

        res.status(200).json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener colecciones" });
    }
};

export const getCollectionGames = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;

        const collection = await Collection.findByPk(Number(collectionId), {
            include: [
                {
                    model: Game,
                    include: [
                        { model: Genre },
                        { model: Platform }
                    ]
                }
            ]
        });

        if (!collection) {
            res.status(404).json({ message: "Colección no encontrada" });
            return;
        }

        res.status(200).json(collection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al cargar los juegos" });
    }
};

export const searchGames = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).json({ message: "No se envio nada para buscar" });
            return;
        }

        const games = await Game.findAll({
            where: {
                title: { [Op.like]: `%${query}%` }
            },
            include: [
                { model: Genre },
                { model: Platform }
            ],
            limit: 10
        });

        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error en el buscador de juegos" });
    }
};

export const createCollection = async (req: Request, res: Response) => {
    try {
        const newCollection = await Collection.create(req.body);
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la colección" });
    }
};

export const updateCollection = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        const [updated] = await Collection.update(req.body, { where: { id: Number(collectionId) } });

        if (updated) {
            const updatedCol = await Collection.findByPk(Number(collectionId));
            res.status(200).json(updatedCol);
        } else {
            res.status(404).json({ message: "Colección no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar colección" });
    }
};

export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        const deleted = await Collection.destroy({ where: { id: Number(collectionId) } });

        if (deleted) {
            res.status(200).json({ message: "Colección eliminada" });
        } else {
            res.status(404).json({ message: "No existe esa colección" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar colección" });
    }
};