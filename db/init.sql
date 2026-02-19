CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user', 
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INT,
    developer VARCHAR(100),
    image_url VARCHAR(255), 
    trailer_url VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE game_genres (
    game_id INT,
    genre_id INT,
    PRIMARY KEY (game_id, genre_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE game_platforms (
    game_id INT,
    platform_id INT,
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

CREATE TABLE user_games (
    user_id INT,
    game_id INT,
    status ENUM('LIKED', 'DISLIKED', 'COMPLETED', 'DROPPED') NOT NULL, 
    is_priority BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	is_finished BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE user_platforms (
    user_id INT,
    platform_id INT,
    PRIMARY KEY (user_id, platform_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

CREATE TABLE collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_system BOOLEAN DEFAULT TRUE
);


CREATE TABLE collection_games (
    collection_id INT,
    game_id INT,
    PRIMARY KEY (collection_id, game_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE friendships (
    user_id_1 INT,
    user_id_2 INT,
    status ENUM('PENDING', 'ACCEPTED', 'BLOCKED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id_1, user_id_2),
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT,
    recommended_game_id INT DEFAULT NULL, 
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_game_id) REFERENCES games(id) ON DELETE SET NULL
);

INSERT INTO users (username, email, password_hash, role, avatar_url) VALUES
('SlayerX', 'slayer@test.com', '$2b$10$X7...', 'admin', 'https://ui-avatars.com/api/?name=Slayer+X&background=random'),
('CozyFarm', 'cozy@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Cozy+Farm&background=random'),
('ShooterPro', 'fps@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Shooter+Pro&background=random'),
('RetroDave', 'dave@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Retro+Dave&background=random'),
('SonyPony', 'sony@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Sony+Pony&background=random'),
('NintyGirl', 'mario@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Ninty+Girl&background=random'),
('PCMaster', 'rgb@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=PC+Master&background=random'),
('CasualDad', 'dad@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Casual+Dad&background=random'),
('HorrorFan', 'boo@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Horror+Fan&background=random'),
('IndieHipster', 'indie@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Indie+Hipster&background=random'),
('FIFA_King', 'fut@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=FIFA+King&background=random'),
('LoreSeeker', 'book@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Lore+Seeker&background=random'),
('SpeedRunner', 'fast@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Speed+Runner&background=random'),
('MobileGamer', 'phone@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Mobile+Gamer&background=random'),
('Strategist', 'civ@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Strategist&background=random'),
('JRPG_Fan', 'weeb@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=JRPG+Fan&background=random'),
('Explorer', 'open@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Explorer&background=random'),
('Achievement', 'plat@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Achievement&background=random'),
('OldSchool', 'boomer@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Old+School&background=random'),
('TechDemo', 'demo@test.com', '$2b$10$X7...', 'user', 'https://ui-avatars.com/api/?name=Tech+Demo&background=random');

INSERT INTO games (title, developer, release_year, description, image_url, trailer_url) VALUES
('Elden Ring', 'FromSoftware', 2022, 'Obra maestra de mundo abierto y dificultad extrema.', 'https://placehold.co/600x400?text=EldenRing', 'https://youtube.com'),
('Baldurs Gate 3', 'Larian Studios', 2023, 'El RPG definitivo basado en D&D. Libertad total.', 'https://placehold.co/600x400?text=BG3', 'https://youtube.com'),
('Zelda: Tears of the Kingdom', 'Nintendo', 2023, 'Explora Hyrule por tierra y aire. Creatividad pura.', 'https://placehold.co/600x400?text=Zelda', 'https://youtube.com'),
('God of War Ragnarök', 'Santa Monica', 2022, 'Kratos y Atreus enfrentan el fin del mundo nórdico.', 'https://placehold.co/600x400?text=GOW', 'https://youtube.com'),
('Cyberpunk 2077', 'CD Projekt RED', 2020, 'RPG futurista en la vibrante y peligrosa Night City.', 'https://placehold.co/600x400?text=Cyberpunk', 'https://youtube.com'),
('Hollow Knight', 'Team Cherry', 2017, 'Metroidvania desafiante con arte dibujado a mano.', 'https://placehold.co/600x400?text=HollowKnight', 'https://youtube.com'),
('Hades', 'Supergiant', 2020, 'Roguelike de acción rápida escapando del infierno griego.', 'https://placehold.co/600x400?text=Hades', 'https://youtube.com'),
('Stardew Valley', 'ConcernedApe', 2016, 'Simulador de granja relajante y vida social.', 'https://placehold.co/600x400?text=Stardew', 'https://youtube.com'),
('The Last of Us Part I', 'Naughty Dog', 2022, 'Narrativa emocional en un mundo post-apocalíptico.', 'https://placehold.co/600x400?text=TLOU', 'https://youtube.com'),
('Red Dead Redemption 2', 'Rockstar', 2018, 'El western definitivo. Historia profunda y realista.', 'https://placehold.co/600x400?text=RDR2', 'https://youtube.com'),
('GTA V', 'Rockstar', 2013, 'Crimen, mundo abierto y sátira americana.', 'https://placehold.co/600x400?text=GTA5', 'https://youtube.com'),
('Minecraft', 'Mojang', 2011, 'Construye y sobrevive. El juego más vendido del mundo.', 'https://placehold.co/600x400?text=Minecraft', 'https://youtube.com'),
('Overwatch 2', 'Blizzard', 2022, 'Shooter de héroes competitivo por equipos.', 'https://placehold.co/600x400?text=Overwatch', 'https://youtube.com'),
('Valorant', 'Riot Games', 2020, 'Shooter táctico 5v5 preciso y competitivo.', 'https://placehold.co/600x400?text=Valorant', 'https://youtube.com'),
('Apex Legends', 'Respawn', 2019, 'Battle Royale frenético con mecánicas de movimiento.', 'https://placehold.co/600x400?text=Apex', 'https://youtube.com'),
('Call of Duty: MW3', 'Activision', 2023, 'Disparos arcades y acción militar rápida.', 'https://placehold.co/600x400?text=COD', 'https://youtube.com'),
('Doom Eternal', 'id Software', 2020, 'Mata demonios al ritmo de Heavy Metal. Adrenalina.', 'https://placehold.co/600x400?text=Doom', 'https://youtube.com'),
('Resident Evil 4 Remake', 'Capcom', 2023, 'Terror y acción sobreviviendo a una secta en España.', 'https://placehold.co/600x400?text=RE4', 'https://youtube.com'),
('Silent Hill 2', 'Konami', 2001, 'Terror psicológico puro. Una historia inolvidable.', 'https://placehold.co/600x400?text=SilentHill', 'https://youtube.com'),
('Phasmophobia', 'Kinetic', 2020, 'Caza fantasmas con amigos usando reconocimiento de voz.', 'https://placehold.co/600x400?text=Phasmo', 'https://youtube.com'),
('FIFA 24', 'EA Sports', 2023, 'El simulador de fútbol más popular del mundo.', 'https://placehold.co/600x400?text=FIFA', 'https://youtube.com'),
('NBA 2K24', '2K', 2023, 'Baloncesto realista y cultura urbana.', 'https://placehold.co/600x400?text=NBA', 'https://youtube.com'),
('Rocket League', 'Psyonix', 2015, 'Fútbol con coches cohete. Fácil de jugar, difícil de dominar.', 'https://placehold.co/600x400?text=Rocket', 'https://youtube.com'),
('Forza Horizon 5', 'Playground', 2021, 'Carreras arcade en un México de mundo abierto.', 'https://placehold.co/600x400?text=Forza', 'https://youtube.com'),
('Gran Turismo 7', 'Polyphony', 2022, 'Simulador de conducción serio y detallista.', 'https://placehold.co/600x400?text=GT7', 'https://youtube.com'),
('Final Fantasy VII Rebirth', 'Square Enix', 2024, 'La continuación épica de la aventura de Cloud.', 'https://placehold.co/600x400?text=FF7', 'https://youtube.com'),
('Persona 5 Royal', 'Atlus', 2019, 'JRPG con estilo, música jazz y vida estudiantil.', 'https://placehold.co/600x400?text=Persona5', 'https://youtube.com'),
('Sea of Stars', 'Sabotage', 2023, 'RPG retro inspirado en los clásicos de SNES.', 'https://placehold.co/600x400?text=SeaOfStars', 'https://youtube.com'),
('Vampire Survivors', 'Poncle', 2021, 'Juego adictivo de supervivencia minimalista.', 'https://placehold.co/600x400?text=Vampire', 'https://youtube.com'),
('Celeste', 'Maddy Thorson', 2018, 'Plataformas difícil sobre superar la ansiedad.', 'https://placehold.co/600x400?text=Celeste', 'https://youtube.com'),
('Cuphead', 'Studio MDHR', 2017, 'Run and gun con estética de dibujos de los años 30.', 'https://placehold.co/600x400?text=Cuphead', 'https://youtube.com'),
('Undertale', 'Toby Fox', 2015, 'El RPG donde no tienes que matar a nadie.', 'https://placehold.co/600x400?text=Undertale', 'https://youtube.com'),
('Dead Cells', 'Motion Twin', 2018, 'Rogue-lite de acción rápida y fluida.', 'https://placehold.co/600x400?text=DeadCells', 'https://youtube.com'),
('Slay the Spire', 'Mega Crit', 2019, 'Construcción de mazos y estrategia roguelike.', 'https://placehold.co/600x400?text=SlayTheSpire', 'https://youtube.com'),
('Among Us', 'Innersloth', 2018, 'Descubre al impostor en tu nave espacial.', 'https://placehold.co/600x400?text=AmongUs', 'https://youtube.com'),
('Genshin Impact', 'HoYoverse', 2020, 'Mundo abierto Gacha estilo anime.', 'https://placehold.co/600x400?text=Genshin', 'https://youtube.com'),
('League of Legends', 'Riot Games', 2009, 'MOBA competitivo. El rey de los eSports.', 'https://placehold.co/600x400?text=LOL', 'https://youtube.com'),
('Dota 2', 'Valve', 2013, 'MOBA complejo y profundo.', 'https://placehold.co/600x400?text=Dota2', 'https://youtube.com'),
('Civilization VI', 'Firaxis', 2016, 'Estrategia 4X. Construye un imperio que resista el tiempo.', 'https://placehold.co/600x400?text=Civ6', 'https://youtube.com'),
('XCOM 2', 'Firaxis', 2016, 'Estrategia táctica contra aliens. Muy difícil.', 'https://placehold.co/600x400?text=XCOM2', 'https://youtube.com'),
('Super Mario Odyssey', 'Nintendo', 2017, 'Plataformas 3D lleno de alegría y creatividad.', 'https://placehold.co/600x400?text=MarioOdyssey', 'https://youtube.com'),
('Mario Kart 8 Deluxe', 'Nintendo', 2017, 'Carreras de karts divertidas para todos.', 'https://placehold.co/600x400?text=MarioKart', 'https://youtube.com'),
('Super Smash Bros. Ultimate', 'Nintendo', 2018, 'Lucha crossover con todos los personajes de la historia.', 'https://placehold.co/600x400?text=Smash', 'https://youtube.com'),
('Animal Crossing: New Horizons', 'Nintendo', 2020, 'Simulador de vida en una isla desierta.', 'https://placehold.co/600x400?text=AnimalCrossing', 'https://youtube.com'),
('Splatoon 3', 'Nintendo', 2022, 'Guerra de pintura multijugador.', 'https://placehold.co/600x400?text=Splatoon', 'https://youtube.com'),
('Fire Emblem Engage', 'Nintendo', 2023, 'Rol táctico y estrategia por turnos.', 'https://placehold.co/600x400?text=FireEmblem', 'https://youtube.com'),
('Marvels Spider-Man 2', 'Insomniac', 2023, 'Acción y aventura con Peter y Miles.', 'https://placehold.co/600x400?text=Spiderman', 'https://youtube.com'),
('Horizon Forbidden West', 'Guerrilla', 2022, 'Aventura en un mundo post-apocalíptico.', 'https://placehold.co/600x400?text=Horizon', 'https://youtube.com'),
('Uncharted 4', 'Naughty Dog', 2016, 'El final de la historia de Nathan Drake.', 'https://placehold.co/600x400?text=Uncharted', 'https://youtube.com'),
('Dark Souls III', 'FromSoftware', 2016, 'El cierre épico de la saga Souls.', 'https://placehold.co/600x400?text=DarkSouls3', 'https://youtube.com');

INSERT INTO platforms (name) VALUES 
('PC'), 
('PlayStation 5'), 
('Xbox Series X/S'), 
('Nintendo Switch'), 
('Mobile');

INSERT INTO genres (name) VALUES 
('RPG'), 
('Action'), 
('Adventure'), 
('Indie'), 
('Shooter'), 
('Strategy'), 
('Sports'), 
('Horror'), 
('Puzzle'), 
('Fighting');

INSERT INTO collections (title, description, image_url) VALUES 
('GOTY Winners', 'Los ganadores del Juego del Año.', 'https://placehold.co/600x400/gold/white?text=GOTY'),
('Indie Gems', 'Pequeños equipos, grandes experiencias.', 'https://placehold.co/600x400/purple/white?text=Indie'),
('Para jugar con amigos', 'Multijugador divertido y caótico.', 'https://placehold.co/600x400/orange/white?text=Party');

INSERT INTO game_platforms (game_id, platform_id) VALUES 
(3, 4), (41, 4), (42, 4), (43, 4), (44, 4), (45, 4), (46, 4),

(14, 1), (37, 1), (38, 1), (39, 1), (40, 1), (35, 1),
(4, 2), (9, 2), (25, 2), (26, 2), (47, 2), (48, 2), (49, 2),
(1, 1), (1, 2), (1, 3),  
(2, 1), (2, 2), (2, 3),   
(5, 1), (5, 2), (5, 3),   
(10, 1), (10, 2), (10, 3), 
(11, 1), (11, 2), (11, 3), 
(13, 1), (13, 2), (13, 3), 
(15, 1), (15, 2), (15, 3), 
(16, 1), (16, 2), (16, 3), 
(17, 1), (17, 2), (17, 3), 
(18, 1), (18, 2), (18, 3), 
(19, 1), (19, 2), (19, 3), 
(20, 1),                   
(21, 1), (21, 2), (21, 3), 
(22, 1), (22, 2), (22, 3), 
(23, 1), (23, 2), (23, 3), 
(50, 1), (50, 2), (50, 3), 

(6, 1), (6, 4),
(7, 1), (7, 4),
(8, 1), (8, 4), (8, 5),    
(29, 1), (29, 4), (29, 5),
(30, 1), (30, 4),
(31, 1), (31, 4), (31, 3), 
(32, 1), (32, 4),
(33, 1), (33, 4), (33, 5),
(34, 1), (34, 4), (34, 5),
(12, 1), (12, 2), (12, 3), (12, 4), (12, 5); 

INSERT INTO game_genres (game_id, genre_id) VALUES 
(1, 1), (1, 2),
(2, 1), (2, 6),
(5, 1), (5, 5),
(26, 1), (26, 2),
(27, 1),
(28, 1), (28, 4),
(36, 1), (36, 3),
(45, 1), (45, 3),
(50, 1), (50, 2),
(32, 1), (32, 4),

(3, 3), (3, 2),
(4, 2), (4, 3),
(9, 2), (9, 3), (9, 8),
(10, 2), (10, 3),
(11, 2), (11, 3),
(12, 3), (12, 4),
(41, 3), (41, 9),
(46, 2), (46, 3),
(47, 2), (47, 3),
(48, 2), (48, 3),
(49, 2), (49, 3),

(13, 5), (13, 2),
(14, 5), (14, 6),
(15, 5), (15, 2),
(16, 5), (16, 2),
(17, 5), (17, 2),

(18, 8), (18, 2),
(19, 8), (19, 9),
(20, 8), (20, 4),

(21, 7),
(22, 7),
(23, 7), (23, 4),
(24, 7),
(25, 7),
(42, 7),

(6, 4), (6, 2),
(7, 4), (7, 2),
(8, 4), (8, 6),
(29, 4), (29, 2),
(30, 4), (30, 3),
(31, 4), (31, 2),
(33, 4), (33, 2),
(34, 4), (34, 6),
(35, 4), (35, 6),

(37, 6), (37, 2),
(38, 6), (38, 2),
(39, 6),
(40, 6),
(43, 10), (43, 2),
(44, 6);

INSERT INTO collection_games (collection_id, game_id) VALUES 
(1, 1),  
(1, 2),  
(1, 3),  
(1, 4),  
(1, 9),  
(1, 10), 
(1, 17), 

(2, 6),  
(2, 7),  
(2, 8),  
(2, 29), 
(2, 30), 
(2, 31), 
(2, 32), 
(2, 33), 

(3, 13), 
(3, 14), 
(3, 23), 
(3, 35), 
(3, 42), 
(3, 43),
(3, 20); 

INSERT INTO messages (sender_id, receiver_id, content, recommended_game_id) VALUES 
(1, 2, '¡Hey! Tienes que probar esto, es una obra maestra.', NULL),
(1, 2, 'Mira, es difícil pero vale la pena.', 1),
(2, 1, 'Uff, se ve demasiado estresante para mí ahora mismo...', NULL),
(2, 1, 'Yo estoy viciado a esto, es pura paz.', 8);

INSERT INTO user_games (user_id, game_id, status, is_priority, is_finished) VALUES 
(1, 1, 'LIKED', 1, 0),
(1, 50, 'LIKED', 1, 0),
(1, 7, 'LIKED', 0, 0),  -- Hades (Jugando)
(1, 6, 'LIKED', 0, 0),  -- Hollow Knight (Jugando)
(1, 17, 'LIKED', 1, 0),
(1, 2, 'LIKED', 0, 0),
(1, 5, 'LIKED', 0, 0),
(1, 8, 'DISLIKED', 0, 0),
(1, 44, 'DISLIKED', 0, 0),
(2, 8, 'LIKED', 1, 0),
(2, 44, 'LIKED', 1, 0),
(2, 41, 'COMPLETED', 0, 1),
(2, 30, 'LIKED', 0, 0),
(2, 3, 'LIKED', 0, 0),
(3, 14, 'LIKED', 1, 0),
(3, 16, 'LIKED', 1, 0),
(3, 13, 'LIKED', 1, 0),
(3, 1, 'DROPPED', 0, 0);

INSERT INTO friendships (user_id_1, user_id_2, status) VALUES 
(1, 2, 'ACCEPTED'),
(1, 3, 'ACCEPTED'),
(3, 7, 'ACCEPTED'),
(2, 6, 'ACCEPTED'),
(4, 1, 'PENDING'),
(8, 2, 'PENDING'),
(5, 1, 'PENDING'),
(6, 5, 'BLOCKED');

INSERT INTO user_platforms (user_id, platform_id) VALUES
(1, 1), (1, 2),
(2, 4), (2, 5),
(3, 1),
(4, 1), (4, 4),
(5, 2),
(6, 4),
(7, 1), 
(8, 3), (8, 5),
(9, 1), (9, 2),
(10, 1), (10, 4),
(14, 5),
(15, 1);