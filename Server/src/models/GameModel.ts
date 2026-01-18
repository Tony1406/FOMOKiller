import pool from '../config/db.js';
import type { IGame } from '../interfaces/IGame.js';

export class GameModel {
    static async findAll() { /* Lógica SQL aquí */ }
    static async findById(id: number) { /* Lógica SQL aquí */ }
    static async create(game: IGame) { /* Lógica SQL aquí */ }
}