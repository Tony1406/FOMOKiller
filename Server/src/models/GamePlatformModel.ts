import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const GamePlatform = sequelize.define('GamePlatform', {
    gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'game_id',
        references: { model: 'games', key: 'id' }
    },
    platformId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'platform_id',
        references: { model: 'platforms', key: 'id' }
    }
}, {
    tableName: 'game_platforms',
    timestamps: false,
    underscored: true
});