-- ============================================================
--  FOMOKiller — Schema de referencia
--  Fuente de verdad: Server/src/models/
--  Generado automáticamente por Sequelize sync({ alter: true })
--
--  USO LOCAL:
--    No importes este archivo. Crea la DB vacía y deja que
--    el servidor cree las tablas al arrancar.
--
--  USO DOCKER / CI:
--    Este archivo puede usarse como script de inicialización.
-- ============================================================

CREATE DATABASE IF NOT EXISTS fomokiller
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fomokiller;

SET FOREIGN_KEY_CHECKS = 0;

-- ─── GAMES ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `games` (
  `id`           int          NOT NULL AUTO_INCREMENT,
  `title`        varchar(255) NOT NULL,
  `description`  text,
  `release_year` int          DEFAULT NULL,
  `developer`    varchar(100) DEFAULT NULL,
  `image_url`    varchar(255) DEFAULT NULL,
  `trailer_url`  varchar(255) DEFAULT NULL,
  `rawg_id`      int          DEFAULT NULL,
  `rawg_slug`    varchar(200) DEFAULT NULL,
  `tags`         text,
  `playtime`     int          DEFAULT NULL,
  `created_at`   datetime     NOT NULL,
  `updated_at`   datetime     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `games_rawg_id_unique` (`rawg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── USERS ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `users` (
  `id`                       int          NOT NULL AUTO_INCREMENT,
  `username`                 varchar(50)  NOT NULL,
  `email`                    varchar(100) NOT NULL,
  `password_hash`            varchar(255) NOT NULL,
  `role`                     enum('admin','user') DEFAULT 'user',
  `avatar_url`               varchar(255) DEFAULT NULL,
  `banner_url`               varchar(255) DEFAULT NULL,
  `bio`                      text,
  `has_completed_onboarding` tinyint(1)   DEFAULT 0,
  `created_at`               datetime     NOT NULL,
  `updated_at`               datetime     NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── GENRES ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `genres` (
  `id`   int         NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PLATFORMS ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `platforms` (
  `id`   int         NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── GAME_GENRES (pivot) ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `game_genres` (
  `game_id`  int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`game_id`, `genre_id`),
  KEY `fk_game_genres_genre` (`genre_id`),
  CONSTRAINT `fk_game_genres_game`  FOREIGN KEY (`game_id`)  REFERENCES `games`  (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_game_genres_genre` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── GAME_PLATFORMS (pivot) ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `game_platforms` (
  `game_id`     int NOT NULL,
  `platform_id` int NOT NULL,
  PRIMARY KEY (`game_id`, `platform_id`),
  KEY `fk_game_platforms_platform` (`platform_id`),
  CONSTRAINT `fk_game_platforms_game`     FOREIGN KEY (`game_id`)     REFERENCES `games`     (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_game_platforms_platform` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── USER_GAMES ──────────────────────────────────────────────────────────────
--  status:         LIKED = en backlog, COMPLETED = terminado, DROPPED = descartado
--  is_priority:    aparece en Top 5
--  priority_order: posición dentro del Top 5 (1-5)
--  is_finished:    marcado como completado dentro del Top 5

CREATE TABLE IF NOT EXISTS `user_games` (
  `user_id`        int  NOT NULL,
  `game_id`        int  NOT NULL,
  `status`         enum('LIKED','DISLIKED','COMPLETED','DROPPED') NOT NULL,
  `is_priority`    tinyint(1) DEFAULT 0,
  `is_finished`    tinyint(1) DEFAULT 0,
  `priority_order` int        DEFAULT NULL,
  PRIMARY KEY (`user_id`, `game_id`),
  KEY `fk_user_games_game` (`game_id`),
  CONSTRAINT `fk_user_games_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_games_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── USER_PREFERENCES ────────────────────────────────────────────────────────
--  Respuestas del wizard de onboarding. Alimentan el algoritmo de recomendación.
--  platforms:        JSON array ["PC", "PlayStation 5", ...]
--  session_length:   duración de sesión preferida
--  feeling:          qué busca el usuario al abrir un juego
--  world_type:       ambientación preferida
--  depth:            tipo de experiencia (casual, narrativa, etc.)
--  ignore_history:   modo exploración — ignora likes previos
--  history_reset_at: los likes anteriores a esta fecha no cuentan para el algoritmo

CREATE TABLE IF NOT EXISTS `user_preferences` (
  `id`               int  NOT NULL AUTO_INCREMENT,
  `user_id`          int  NOT NULL,
  `platforms`        json DEFAULT NULL,
  `session_length`   enum('short','medium','long')                          DEFAULT NULL,
  `feeling`          enum('tension','story','relax','adrenaline','build')   DEFAULT NULL,
  `world_type`       enum('fantasy','scifi','horror','openworld','realism') DEFAULT NULL,
  `depth`            enum('casual','complex','narrative','challenge')        DEFAULT NULL,
  `ignore_history`   tinyint(1) DEFAULT 0,
  `history_reset_at` datetime   DEFAULT NULL,
  `min_year`         int        DEFAULT NULL,
  `max_year`         int        DEFAULT NULL,
  `created_at`       datetime NOT NULL,
  `updated_at`       datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_preferences_user` (`user_id`),
  CONSTRAINT `fk_user_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── COLLECTIONS ─────────────────────────────────────────────────────────────
--  Colecciones curadas por el admin (RPGs, Indie, Terror, etc.)
--  is_system: true = creada desde el panel admin

CREATE TABLE IF NOT EXISTS `collections` (
  `id`          int          NOT NULL AUTO_INCREMENT,
  `title`       varchar(100) NOT NULL,
  `description` text,
  `image_url`   varchar(255) DEFAULT NULL,
  `is_system`   tinyint(1)   DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── COLLECTION_GAMES (pivot) ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `collection_games` (
  `collection_id` int NOT NULL,
  `game_id`       int NOT NULL,
  PRIMARY KEY (`collection_id`, `game_id`),
  KEY `fk_collection_games_game` (`game_id`),
  CONSTRAINT `fk_collection_games_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_collection_games_game`       FOREIGN KEY (`game_id`)       REFERENCES `games`       (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── USER_PLATFORMS (pivot) ──────────────────────────────────────────────────
--  Plataformas que el usuario marcó durante el onboarding.
--  Usado por el filtro de plataforma del algoritmo de recomendación.

CREATE TABLE IF NOT EXISTS `user_platforms` (
  `user_id`     int NOT NULL,
  `platform_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `platform_id`),
  KEY `fk_user_platforms_platform` (`platform_id`),
  CONSTRAINT `fk_user_platforms_user`     FOREIGN KEY (`user_id`)     REFERENCES `users`     (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_platforms_platform` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
