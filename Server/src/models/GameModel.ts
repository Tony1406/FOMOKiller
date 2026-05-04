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
    },
    gameplayUrl: {
        type: DataTypes.STRING(255),
        field: 'gameplay_url'
    },
    rawgId: {
        type: DataTypes.INTEGER,
        field: 'rawg_id'
    },
    rawgSlug: {
        type: DataTypes.STRING(200),
        field: 'rawg_slug'
    },
    tags: {
        type: DataTypes.TEXT
    },
    playtime: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'games',
    timestamps: true,
    underscored: true
});