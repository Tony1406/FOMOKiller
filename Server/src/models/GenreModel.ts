import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Genre = sequelize.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'genres',
    timestamps: false,
    underscored: true
});