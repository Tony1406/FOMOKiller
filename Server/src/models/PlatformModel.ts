import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Platform = sequelize.define('Platform', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'platforms',
    timestamps: false,
    underscored: true
});