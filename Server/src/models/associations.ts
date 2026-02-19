import { User } from './UserModel.js';
import { Game } from './GameModel.js';
import { UserGame } from './UserGameModel.js';
import { Genre } from './GenreModel.js';
import { GameGenre } from './GameGenreModel.js';
import { Platform } from './PlatformModel.js';
import { GamePlatform } from './GamePlatformModel.js';
import { UserPlatform } from './UserPlatformModel.js';
import { Collection } from './CollectionModel.js';
import { CollectionGame } from './CollectionGameModel.js';
import { Message } from './MessageModel.js';
import { Friendship } from './FriendshipModel.js';

export const defineAssociations = () => {

    User.belongsToMany(Game, { through: UserGame, foreignKey: 'userId', otherKey: 'gameId' });
    Game.belongsToMany(User, { through: UserGame, foreignKey: 'gameId', otherKey: 'userId' });

    User.hasMany(UserGame, { foreignKey: 'userId' });
    UserGame.belongsTo(User, { foreignKey: 'userId' });

    Game.hasMany(UserGame, { foreignKey: 'gameId' });
    UserGame.belongsTo(Game, { foreignKey: 'gameId' });


    Game.belongsToMany(Genre, { through: GameGenre, foreignKey: 'gameId', otherKey: 'genreId' });
    Genre.belongsToMany(Game, { through: GameGenre, foreignKey: 'genreId', otherKey: 'gameId' });

    Game.belongsToMany(Platform, { through: GamePlatform, foreignKey: 'gameId', otherKey: 'platformId' });
    Platform.belongsToMany(Game, { through: GamePlatform, foreignKey: 'platformId', otherKey: 'gameId' });

    User.belongsToMany(Platform, { through: UserPlatform, foreignKey: 'userId', otherKey: 'platformId' });
    Platform.belongsToMany(User, { through: UserPlatform, foreignKey: 'platformId', otherKey: 'userId' });


    Collection.belongsToMany(Game, { through: CollectionGame, foreignKey: 'collectionId', otherKey: 'gameId' });
    Game.belongsToMany(Collection, { through: CollectionGame, foreignKey: 'gameId', otherKey: 'collectionId' });


    User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
    Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });

    User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });
    Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

    Game.hasMany(Message, { foreignKey: 'recommendedGameId' });
    Message.belongsTo(Game, { as: 'RecommendedGame', foreignKey: 'recommendedGameId' });


    User.belongsToMany(User, {
        as: 'Friends',
        through: Friendship,
        foreignKey: 'userId1',
        otherKey: 'userId2'
    });

    User.belongsToMany(User, {
        as: 'FriendOf',
        through: Friendship,
        foreignKey: 'userId2',
        otherKey: 'userId1'
    });
};