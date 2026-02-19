import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sender_id',
        references: { model: 'users', key: 'id' }
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'receiver_id',
        references: { model: 'users', key: 'id' }
    },
    content: {
        type: DataTypes.TEXT
    },
    recommendedGameId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'recommended_game_id',
        references: { model: 'games', key: 'id' }
    },
    sentAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'sent_at'
    }
}, {
    tableName: 'messages',
    timestamps: false,
    underscored: true
});