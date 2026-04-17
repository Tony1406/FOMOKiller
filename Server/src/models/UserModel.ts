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
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
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
    },
    hasCompletedOnboarding: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_completed_onboarding'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});