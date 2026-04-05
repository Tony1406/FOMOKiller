import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const UserGame = sequelize.define('UserGame', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'game_id',
        references: {
            model: 'games',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    status: {
        type: DataTypes.ENUM('LIKED', 'DISLIKED', 'COMPLETED', 'DROPPED'),
        allowNull: false
    },
    isPriority: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_priority'
    },
    isFinished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_finished'
    },
    priorityOrder: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        field: 'priority_order'
    }
}, {
    tableName: 'user_games',
    timestamps: false,
    underscored: true
});