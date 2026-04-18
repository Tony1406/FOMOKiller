# Base de datos

FOMOKiller usa **MySQL** como base de datos relacional, gestionada mediante el ORM **Sequelize 6**. El esquema se sincroniza automáticamente al arrancar el servidor con `sequelize.sync({ alter: true })`.

---

## Diagrama entidad-relación

```
┌──────────┐        ┌─────────────────┐
│  users   │ 1 ─── 1│ user_preferences│
└────┬─────┘        └─────────────────┘
     │ 1
     │ M
┌────▼──────────┐
│  user_games   │ (tabla de unión con datos extra)
└────┬──────────┘
     │ M          M
┌────▼─────┐◄────►┌─────────────┐
│  games   │      │   genres    │ (a través de game_genres)
└────┬─────┘
     │ M          M
     │◄───────────►┌─────────────┐
     │             │  platforms  │ (a través de game_platforms)
     │ M          M
     │◄───────────►┌─────────────────┐
                   │   collections   │ (a través de collection_games)
                   └─────────────────┘
```

---

## Tablas principales

### `users`

Almacena todos los usuarios de la aplicación.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | Identificador único |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Nombre de usuario |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Email |
| `password_hash` | VARCHAR(255) | NOT NULL | Contraseña hasheada con bcrypt |
| `role` | ENUM | NOT NULL, DEFAULT 'user' | `'admin'` o `'user'` |
| `avatar_url` | VARCHAR(255) | NULL | URL del avatar |
| `banner_url` | VARCHAR(255) | NULL | URL del banner de perfil |
| `bio` | TEXT | NULL | Descripción del usuario |
| `has_completed_onboarding` | BOOLEAN | DEFAULT false | Si ha completado el wizard |
| `created_at` | DATETIME | — | Fecha de creación |
| `updated_at` | DATETIME | — | Última modificación |

---

### `user_preferences`

Almacena las respuestas del wizard de onboarding para el sistema de recomendaciones.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | — |
| `user_id` | INTEGER | FK → users.id | Propietario |
| `platforms` | JSON | — | Lista de plataformas preferidas, ej: `["PC", "PlayStation 5"]` |
| `session_length` | ENUM | — | `'short'` / `'medium'` / `'long'` |
| `feeling` | ENUM | — | `'tension'` / `'story'` / `'relax'` / `'adrenaline'` / `'build'` |
| `world_type` | ENUM | — | `'fantasy'` / `'scifi'` / `'horror'` / `'openworld'` / `'realism'` |
| `depth` | ENUM | — | `'casual'` / `'complex'` / `'narrative'` / `'challenge'` |
| `ignore_history` | BOOLEAN | DEFAULT false | Modo exploración (ignora likes previos) |
| `history_reset_at` | DATE | NULL | Fecha desde la que contar los likes |
| `min_year` | INTEGER | NULL | Año mínimo de juegos recomendados |
| `max_year` | INTEGER | NULL | Año máximo de juegos recomendados |

---

### `games`

Catálogo de juegos de la plataforma.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | — |
| `title` | VARCHAR(255) | NOT NULL | Nombre del juego |
| `description` | TEXT | NULL | Sinopsis |
| `release_year` | INTEGER | NULL | Año de lanzamiento |
| `developer` | VARCHAR(100) | NULL | Estudio desarrollador |
| `image_url` | VARCHAR(255) | NULL | Imagen de portada |
| `trailer_url` | VARCHAR(255) | NULL | URL del trailer |
| `rawg_id` | INTEGER | UNIQUE, NULL | ID en RAWG API |
| `rawg_slug` | VARCHAR(200) | NULL | Slug en RAWG API |
| `tags` | TEXT | NULL | Tags de RAWG separados por comas |
| `playtime` | INTEGER | NULL | Duración media en horas |

---

### `user_games` (tabla de unión enriquecida)

Relaciona usuarios con juegos, con metadatos adicionales.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `user_id` | INTEGER | PK, FK → users.id | — |
| `game_id` | INTEGER | PK, FK → games.id | — |
| `status` | ENUM | NOT NULL | `'LIKED'` / `'DISLIKED'` / `'COMPLETED'` / `'DROPPED'` |
| `is_priority` | BOOLEAN | DEFAULT false | Si está en el Top 5 |
| `is_finished` | BOOLEAN | DEFAULT false | Si el usuario lo ha terminado |
| `priority_order` | INTEGER | NULL | Posición en el Top 5 (1-5) |

---

### `genres`

Tabla de géneros de videojuegos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | — |
| `name` | VARCHAR(50) | Ej: "Action", "RPG", "Strategy" |

---

### `platforms`

Plataformas de juego.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | — |
| `name` | VARCHAR(50) | Ej: "PC", "PlayStation 5", "Nintendo Switch" |

---

### `collections`

Colecciones curadas de juegos (GOTYs, Indies, etc.).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | INTEGER | PK | — |
| `title` | VARCHAR(100) | NOT NULL | Nombre de la colección |
| `description` | TEXT | NULL | Descripción |
| `image_url` | VARCHAR(255) | NULL | Imagen de portada |
| `is_system` | BOOLEAN | DEFAULT true | Si es una colección del sistema (no de usuario) |

---

## Tablas de unión (muchos a muchos)

| Tabla | Relaciona | Descripción |
|-------|-----------|-------------|
| `game_genres` | games ↔ genres | Géneros de cada juego |
| `game_platforms` | games ↔ platforms | Plataformas en las que está disponible |
| `collection_games` | collections ↔ games | Juegos dentro de cada colección |
| `user_platforms` | users ↔ platforms | Plataformas preferidas del usuario (onboarding) |

---

## Relaciones Sequelize

Definidas en `Server/src/models/associations.ts`:

```
User      1:1   UserPreference
User      M:N   Game            (a través de UserGame)
User      hasMany UserGame
Game      M:N   Genre           (a través de GameGenre)
Game      M:N   Platform        (a través de GamePlatform)
Game      M:N   Collection      (a través de CollectionGame)
Game      hasMany UserGame
```

Todas las relaciones con FK tienen `onDelete: 'CASCADE'` donde corresponde.

---

## Notas importantes

- **`sequelize.sync({ alter: true })`**: Al arrancar, Sequelize ajusta las tablas para que coincidan con los modelos sin borrar datos. En producción real se usarían migraciones.
- **`tags` como TEXT**: Los tags de RAWG se guardan como string separado por comas en lugar de una tabla propia, para simplificar las queries del algoritmo de recomendaciones.
- **`platforms` como JSON en `user_preferences`**: Las plataformas del onboarding se guardan como array JSON directamente, ya que solo se usan para filtrar recomendaciones y no requieren queries relacionales.
- **Contraseñas**: Nunca se almacena la contraseña en texto plano. Se usa `bcrypt` con 10 rondas de salt.
