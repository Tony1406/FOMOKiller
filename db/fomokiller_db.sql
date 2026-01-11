DROP DATABASE IF EXISTS Fomokiller;
CREATE DATABASE Fomokiller;
USE Fomokiller;

-- 1. USUARIOS (Soporta: Account, Chat, Admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VIDEOJUEGOS (Soporta: Home, Explore)
-- Nota: Sin reviews, solo info visual y descriptiva.
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INT,
    developer VARCHAR(100),
    image_url VARCHAR(255), -- Portada
    trailer_url VARCHAR(255), -- Link YouTube/MP4
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CLASIFICACIÓN (Para filtros de Onboarding y Explore)
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

-- 4. INTERACCIÓN (El Corazón: Swipe, Backlog, Priorities)
CREATE TABLE user_games (
    user_id INT,
    game_id INT,
    status ENUM('LIKED', 'DISLIKED', 'COMPLETED', 'DROPPED') NOT NULL, 
    -- LIKED va al Backlog. DISLIKED no se vuelve a mostrar en Home.
    is_priority BOOLEAN DEFAULT FALSE, -- Aquí controlaremos el "Máximo 5" en el Backend.
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	is_finished BOOLEAN DEFAULT FALSE, -- Aquí controlaremos el "Máximo 5" en el Backend.
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 5. PREFERENCIAS (Filtro de la "Entrevista Inicial")
CREATE TABLE user_preferences (
    user_id INT,
    genre_id INT,
    PRIMARY KEY (user_id, genre_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- 6. COLECCIONES CURADAS (Sección Explore: Game Awards, Moods...)
CREATE TABLE collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_system BOOLEAN DEFAULT TRUE -- Creadas por Admin
);

CREATE TABLE collection_games (
    collection_id INT,
    game_id INT,
    PRIMARY KEY (collection_id, game_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 7. SOCIAL Y CHAT (Chat con amigos y envío de juegos)
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
    recommended_game_id INT DEFAULT NULL, -- Clave para enviar "Cards" de juegos
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_game_id) REFERENCES games(id) ON DELETE SET NULL
);

-- 8. DATOS DE PRUEBA INICIALES
INSERT INTO genres (name) VALUES ('RPG'), ('Acción'), ('Aventura'), ('Indie'), ('Metroidvania');
INSERT INTO platforms (name) VALUES ('PC'), ('PS5'), ('Nintendo Switch'), ('Xbox Series X');

INSERT INTO games (title, description, release_year, developer, image_url) VALUES 
('Elden Ring', 'Mundo abierto de FromSoftware.', 2022, 'FromSoftware', 'https://via.placeholder.com/300x400'),
('Hollow Knight', 'Desafío indie en Hallownest.', 2017, 'Team Cherry', 'https://via.placeholder.com/300x400'),
('God of War Ragnarök', 'Kratos en los nueve reinos.', 2022, 'Santa Monica', 'https://via.placeholder.com/300x400');

-- Relacionar juegos con géneros (Prueba)
INSERT INTO game_genres (game_id, genre_id) VALUES (1, 1), (1, 3), (2, 4), (2, 5), (3, 2), (3, 3);