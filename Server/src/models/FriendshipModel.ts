import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Friendship = sequelize.define('Friendship', {
    userId1: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id_1',
        references: { model: 'users', key: 'id' }
    },
    userId2: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id_2',
        references: { model: 'users', key: 'id' }
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'BLOCKED'),
        defaultValue: 'PENDING'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'friendships',
    timestamps: false,
    underscored: true
});