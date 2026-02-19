import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Collection = sequelize.define('Collection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        field: 'image_url'
    },
    isSystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_system'
    }
}, {
    tableName: 'collections',
    timestamps: false,
    underscored: true
});