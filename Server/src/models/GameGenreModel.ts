import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const GameGenre = sequelize.define('GameGenre', {
    gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'game_id',
        references: { model: 'games', key: 'id' }
    },
    genreId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'genre_id',
        references: { model: 'genres', key: 'id' }
    }
}, {
    tableName: 'game_genres',
    timestamps: false,
    underscored: true
});