import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const UserPreference = sequelize.define('UserPreference', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    // Plataformas seleccionadas: ["PC", "PlayStation", ...]
    platforms: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    // Tipos de juego seleccionados (multi): ["action", "rpg", ...]
    gameType: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        field: 'game_type'
    },
    // Duración preferida (multi): ["short", "long", ...]
    sessionLength: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        field: 'session_pref'
    },
    // Modo de juego: "solo" | "multi" | "any"
    playMode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'play_mode'
    },
    // Campos legacy — mantenidos para usuarios con onboarding anterior
    feeling: {
        type: DataTypes.STRING,
        allowNull: true
    },
    worldType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'world_type'
    },
    depth: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Modo exploración: ignora el historial de likes, solo usa onboarding
    ignoreHistory: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'ignore_history'
    },
    historyResetAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        field: 'history_reset_at'
    },
    // Filtro de año: null = sin límite
    minYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        field: 'min_year'
    },
    maxYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        field: 'max_year'
    }
}, {
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true
});
