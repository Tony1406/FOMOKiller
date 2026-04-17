import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Guarda las respuestas del wizard de onboarding como JSON
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
    // Plataformas seleccionadas: ["PC", "PlayStation 5", ...]
    platforms: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    // Respuesta a "¿Cómo son tus sesiones?" → "short" | "medium" | "long"
    sessionLength: {
        type: DataTypes.ENUM('short', 'medium', 'long'),
        field: 'session_length'
    },
    // Respuesta a "¿Qué buscas al abrir un juego?" → "tension" | "story" | "relax" | "adrenaline" | "build"
    feeling: {
        type: DataTypes.ENUM('tension', 'story', 'relax', 'adrenaline', 'build')
    },
    // Respuesta a "¿Qué ambientación te llama?" → "fantasy" | "scifi" | "horror" | "openworld" | "realism"
    worldType: {
        type: DataTypes.ENUM('fantasy', 'scifi', 'horror', 'openworld', 'realism'),
        field: 'world_type'
    },
    // Respuesta a "¿Qué te engancha?" → "casual" | "complex" | "narrative" | "challenge"
    depth: {
        type: DataTypes.ENUM('casual', 'complex', 'narrative', 'challenge')
    },
    // Modo exploración: ignora el historial de likes, solo usa onboarding
    ignoreHistory: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'ignore_history'
    },
    // Fecha desde la que se cuentan los likes para el algoritmo
    // Los likes anteriores a esta fecha se ignoran aunque ignoreHistory sea false
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
