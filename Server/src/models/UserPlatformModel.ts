import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const UserPlatform = sequelize.define('UserPlatform', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id',
        references: { model: 'users', key: 'id' }
    },
    platformId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'platform_id',
        references: { model: 'platforms', key: 'id' }
    }
}, {
    tableName: 'user_platforms',
    timestamps: false,
    underscored: true
});