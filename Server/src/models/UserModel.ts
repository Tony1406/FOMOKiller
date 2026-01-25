import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false // Equivalente a required: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash' // Nombre real en la BBDD
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    avatarUrl: {
        type: DataTypes.STRING(255),
        field: 'avatar_url'
    },
    bannerUrl: {
        type: DataTypes.STRING(255),
        field: 'banner_url'
    },
    bio: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'users',      // Nombre de la tabla en MySQL
    timestamps: true,        // Crea createdAt y updatedAt
    underscored: true        // Convierte automáticamente camelCase a snake_case (createdAt -> created_at)
});