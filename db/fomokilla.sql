DROP DATABASE IF EXISTS fomokiller;
CREATE DATABASE fomokiller;
USE fomokiller;

SET FOREIGN_KEY_CHECKS = 0;

-- ─── GAMES ──────────────────────────────────────────────────────────────────

CREATE TABLE games (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    release_year INT,
    developer    VARCHAR(100),
    image_url    VARCHAR(255),
    trailer_url  VARCHAR(255),
    rawg_id      INT          DEFAULT NULL,
    rawg_slug    VARCHAR(200) DEFAULT NULL,
    tags         TEXT,
    playtime     INT          DEFAULT NULL,
    created_at   DATETIME     NOT NULL,
    updated_at   DATETIME     NOT NULL,
    UNIQUE KEY (rawg_id)
);

-- ─── USERS ──────────────────────────────────────────────────────────────────

CREATE TABLE users (
    id                       INT AUTO_INCREMENT PRIMARY KEY,
    username                 VARCHAR(50)  NOT NULL UNIQUE,
    email                    VARCHAR(100) NOT NULL UNIQUE,
    password_hash            VARCHAR(255) NOT NULL,
    role                     ENUM('admin', 'user') DEFAULT 'user',
    avatar_url               VARCHAR(255),
    banner_url               VARCHAR(255),
    bio                      TEXT,
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at               DATETIME NOT NULL,
    updated_at               DATETIME NOT NULL
);

-- ─── GENRES ─────────────────────────────────────────────────────────────────

CREATE TABLE genres (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ─── PLATFORMS ──────────────────────────────────────────────────────────────

CREATE TABLE platforms (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ─── GAME_GENRES ────────────────────────────────────────────────────────────

CREATE TABLE game_genres (
    game_id  INT,
    genre_id INT,
    PRIMARY KEY (game_id, genre_id),
    FOREIGN KEY (game_id)  REFERENCES games  (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

-- ─── GAME_PLATFORMS ─────────────────────────────────────────────────────────

CREATE TABLE game_platforms (
    game_id     INT,
    platform_id INT,
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id)     REFERENCES games     (id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms (id) ON DELETE CASCADE
);

-- ─── USER_GAMES ──────────────────────────────────────────────────────────────
--  status:         LIKED = en backlog | COMPLETED = terminado | DROPPED = descartado
--  is_priority:    aparece en Top 5
--  priority_order: posición dentro del Top 5 (1-5)
--  is_finished:    marcado como completado dentro del Top 5

CREATE TABLE user_games (
    user_id        INT,
    game_id        INT,
    status         ENUM('LIKED', 'DISLIKED', 'COMPLETED', 'DROPPED') NOT NULL,
    is_priority    BOOLEAN DEFAULT FALSE,
    is_finished    BOOLEAN DEFAULT FALSE,
    priority_order INT     DEFAULT NULL,
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
);

-- ─── USER_PREFERENCES ────────────────────────────────────────────────────────
--  Respuestas del onboarding. Alimentan el algoritmo de recomendación.

CREATE TABLE user_preferences (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    platforms        JSON,
    session_length   ENUM('short', 'medium', 'long'),
    feeling          ENUM('tension', 'story', 'relax', 'adrenaline', 'build'),
    world_type       ENUM('fantasy', 'scifi', 'horror', 'openworld', 'realism'),
    depth            ENUM('casual', 'complex', 'narrative', 'challenge'),
    ignore_history   BOOLEAN  DEFAULT FALSE,
    history_reset_at DATETIME DEFAULT NULL,
    min_year         INT      DEFAULT NULL,
    max_year         INT      DEFAULT NULL,
    created_at       DATETIME NOT NULL,
    updated_at       DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ─── COLLECTIONS ─────────────────────────────────────────────────────────────

CREATE TABLE collections (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    image_url   VARCHAR(255),
    is_system   BOOLEAN DEFAULT TRUE
);

-- ─── COLLECTION_GAMES ────────────────────────────────────────────────────────

CREATE TABLE collection_games (
    collection_id INT,
    game_id       INT,
    PRIMARY KEY (collection_id, game_id),
    FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE,
    FOREIGN KEY (game_id)       REFERENCES games       (id) ON DELETE CASCADE
);

-- ─── USER_PLATFORMS ──────────────────────────────────────────────────────────

CREATE TABLE user_platforms (
    user_id     INT,
    platform_id INT,
    PRIMARY KEY (user_id, platform_id),
    FOREIGN KEY (user_id)     REFERENCES users     (id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms (id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
