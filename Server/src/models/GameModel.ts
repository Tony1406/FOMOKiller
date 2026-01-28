import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        field: 'release_year'
    },
    developer: {
        type: DataTypes.STRING(100)
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        field: 'image_url'
    },
    trailerUrl: {
        type: DataTypes.STRING(255),
        field: 'trailer_url'
    }
}, {
    tableName: 'games',
    timestamps: true,
    underscored: true
});