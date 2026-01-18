import pool from '../config/db.js';
import type { IUser } from '../interfaces/IUser.js';

export class UserModel {
    static async findAll() { /* Lógica SQL aquí */ }
    static async findById(id: number) { /* Lógica SQL aquí */ }
    static async create(user: IUser) { /* Lógica SQL aquí */ }
}