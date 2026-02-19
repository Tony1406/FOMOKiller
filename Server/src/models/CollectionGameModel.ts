import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const CollectionGame = sequelize.define('CollectionGame', {
    collectionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'collection_id',
        references: { model: 'collections', key: 'id' }
    },
    gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'game_id',
        references: { model: 'games', key: 'id' }
    }
}, {
    tableName: 'collection_games',
    timestamps: false,
    underscored: true
});