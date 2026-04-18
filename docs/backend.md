# Backend — API REST

El servidor está construido con **Express 5** + **TypeScript**. Sigue el patrón MVC: las rutas delegan en controladores que contienen la lógica de negocio y operan sobre los modelos Sequelize.

**Base URL:** `http://localhost:3000/api`

---

## Entry point (`Server/src/index.ts`)

Al arrancar, el servidor:
1. Carga variables de entorno con `dotenv`
2. Configura CORS para aceptar peticiones de `http://localhost:5173` con cookies
3. Registra los middlewares: `cookieParser`, `express.json()`
4. Llama a `defineAssociations()` para establecer relaciones entre modelos
5. Sincroniza la base de datos con `sequelize.sync({ alter: true })`
6. Registra todos los módulos de rutas
7. Escucha en el puerto definido en `.env` (por defecto: 3000)

---

## Autenticación

Todas las rutas protegidas requieren que el cliente tenga una cookie válida `fomokiller_token`.

**Tecnología:** JWT firmado con `JWT_SECRET`
**Duración:** 7 días
**Almacenamiento:** Cookie HttpOnly (`fomokiller_token`)

### Flujo de autenticación

```
Cliente → POST /api/users/login
        → Servidor verifica email + contraseña (bcrypt)
        → Genera JWT
        → Envía Set-Cookie: fomokiller_token=...
        → Responde con datos de usuario

Peticiones siguientes → Cookie enviada automáticamente
                      → Servidor valida JWT en cada ruta protegida
```

---

## Módulos de rutas

### `/api/users` — Usuarios y autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/register` | Registrar nuevo usuario |
| `POST` | `/login` | Iniciar sesión |
| `GET` | `/me` | Obtener usuario actual (desde JWT) |
| `POST` | `/logout` | Cerrar sesión (borra cookie) |
| `GET` | `/profile/:userId` | Ver perfil de usuario |
| `PUT` | `/profile/:userId` | Actualizar perfil (bio, avatar, banner) |

**Body de `/register`:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Body de `/login`:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Body de `/profile/:userId` (PUT):**
```json
{
  "bio": "string (opcional)",
  "avatarUrl": "string (opcional)",
  "bannerUrl": "string (opcional)"
}
```

---

### `/api/home` — Juegos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/all` | Obtener todos los juegos con géneros y plataformas |
| `GET` | `/details/:id` | Detalles de un juego por ID |
| `POST` | `/create` | (Admin) Crear juego |
| `PUT` | `/update/:id` | (Admin) Actualizar juego |
| `DELETE` | `/delete/:id` | (Admin) Eliminar juego |

---

### `/api/my-games` — Backlog del usuario

| Método | Endpoint | Parámetros | Descripción |
|--------|----------|------------|-------------|
| `GET` | `/backlog` | `?userId=` | Obtener backlog del usuario |
| `GET` | `/priorities` | `?userId=` | Obtener Top 5 |
| `GET` | `/isPriority/:gameId` | `?userId=` | Comprobar si un juego está en Top 5 |
| `GET` | `/isFinished/:gameId` | `?userId=` | Comprobar si un juego está completado |
| `PUT` | `/status` | `?userId=` | Actualizar estado de un juego |
| `PUT` | `/priority` | `?userId=` | Añadir/quitar del Top 5 |
| `PUT` | `/priorities/reorder` | `?userId=` | Reordenar el Top 5 |
| `PUT` | `/finish` | `?userId=` | Marcar como completado |
| `DELETE` | `/clear` | `?userId=` | Vaciar backlog |
| `DELETE` | `/delete/:gameId` | `?userId=` | Eliminar un juego del backlog |

**Body de `/status` (PUT):**
```json
{
  "gameId": 123,
  "status": "LIKED" | "DISLIKED" | "COMPLETED" | "DROPPED"
}
```

**Body de `/priorities/reorder` (PUT):**
```json
{
  "order": [gameId1, gameId2, gameId3]
}
```

---

### `/api/explore` — Colecciones y búsqueda

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/collections` | Listar todas las colecciones |
| `GET` | `/collections/:collectionId` | Juegos de una colección |
| `GET` | `/search?q=query` | Buscar juegos por título (LIKE) |
| `POST` | `/collections` | (Admin) Crear colección |
| `PUT` | `/collections/:collectionId` | (Admin) Actualizar colección |
| `DELETE` | `/collections/:collectionId` | (Admin) Eliminar colección |

---

### `/api/rawg` — Integración con RAWG

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/:slug` | Obtener detalles de un juego desde RAWG API |

Devuelve en paralelo: descripción, desarrollador, publisher, rating ESRB, URL oficial, trailer y screenshots.

---

### `/api/recommendations` — Sistema de recomendaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/preferences` | Guardar preferencias del onboarding |
| `GET` | `/preferences/:userId` | Obtener preferencias guardadas |
| `PATCH` | `/preferences/:userId/toggle-exploration` | Activar/desactivar modo exploración |
| `PATCH` | `/preferences/:userId/reset-history` | Resetear historial de likes |
| `GET` | `/:userId` | Obtener recomendaciones personalizadas |

**Body de `/preferences` (POST):**
```json
{
  "userId": 1,
  "platforms": ["PC", "PlayStation 5"],
  "sessionLength": "medium",
  "feeling": "story",
  "worldType": "fantasy",
  "depth": "narrative",
  "minYear": 2015,
  "maxYear": 2024
}
```

---

### `/api/admin` — Panel de administración

Todas las rutas requieren `role: 'admin'` (middleware `requireAdmin`).

#### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/users` | Listar todos los usuarios |
| `POST` | `/users` | Crear usuario |
| `PUT` | `/users/:id` | Actualizar datos de usuario |
| `PATCH` | `/users/:id/role` | Cambiar rol (`admin` / `user`) |
| `DELETE` | `/users/:id` | Eliminar usuario |

#### Juegos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/games` | Listar todos los juegos |
| `POST` | `/games` | Crear juego manualmente |
| `PUT` | `/games/:id` | Actualizar juego |
| `DELETE` | `/games/:id` | Eliminar juego |
| `GET` | `/platforms` | Listar plataformas disponibles |

#### RAWG (importación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/rawg/search?q=&page=` | Buscar juegos en RAWG |
| `POST` | `/rawg/import` | Importar un juego desde RAWG al catálogo local |

**Body de `/rawg/import`:**
```json
{
  "rawgSlug": "the-witcher-3-wild-hunt"
}
```

#### Colecciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/collections` | Listar colecciones |
| `POST` | `/collections` | Crear colección |
| `PUT` | `/collections/:id` | Actualizar colección |
| `DELETE` | `/collections/:id` | Eliminar colección |
| `GET` | `/collections/:id/games` | Listar juegos de una colección |
| `POST` | `/collections/:id/games` | Añadir juego a colección |
| `DELETE` | `/collections/:id/games/:gameId` | Quitar juego de colección |

---

## Controladores — Lógica de negocio

### `user.controller.ts`

- **`register`**: hashea contraseña con `bcrypt` (10 rounds), crea usuario en BD, emite JWT y lo guarda en cookie HttpOnly.
- **`login`**: busca usuario por email, verifica contraseña con `bcrypt.compare`, emite JWT.
- **`getMe`**: extrae `userId` del JWT de la cookie y devuelve el usuario.
- **`logout`**: limpia la cookie `fomokiller_token`.

### `recommendations.controller.ts`

El controlador más complejo. Implementa un sistema de filtrado por contenido (TF-IDF + similitud coseno) usando la librería `content-based-recommender`.

**Mapeos de preferencias → vocabulario TF-IDF:**

```
FEELING_MAP:
  tension    → "action shooter combat"
  story      → "rpg narrative story adventure"
  relax      → "puzzle casual relaxing"
  adrenaline → "racing sports action fast"
  build      → "simulation building management"

WORLD_MAP:
  fantasy   → "fantasy wizard dragon magic"
  scifi     → "space science fiction futuristic"
  horror    → "horror survival zombie dark"
  openworld → "open world exploration sandbox"
  realism   → "realistic simulation war military"

DEPTH_MAP:
  casual    → "casual puzzle easy indie"
  complex   → "strategy complex deep"
  narrative → "story narrative visual-novel"
  challenge → "difficult rogue souls-like"

SESSION_MAP:
  short  → "short quick indie"
  medium → "medium regular"
  long   → "long immersive epic"
```

**Proceso de generación de recomendaciones:**
1. Leer preferencias del usuario
2. Construir perfil textual concatenando vocabulario del onboarding
3. Si `ignoreHistory = false`, añadir géneros/plataformas/tags de los juegos que el usuario ha dado LIKE
4. Obtener todos los juegos de la BD con sus géneros, plataformas y tags
5. Filtrar por: plataforma del usuario, rango de años, juegos ya en backlog
6. Pre-filtrar a 800 candidatos más relevantes por coincidencia de plataforma
7. Construir documentos textuales para cada juego candidato
8. Entrenar modelo TF-IDF con `ContentBasedRecommender`
9. Devolver top 30 juegos por similitud coseno con el perfil del usuario

### `rawg.controller.ts`

Hace dos peticiones en paralelo a RAWG API:
- `GET /games/{slug}` — Detalles completos
- `GET /games/{slug}/screenshots` — Galería de imágenes

Normaliza y devuelve un objeto con: descripción, desarrollador, publisher, ESRB, website, trailer URL, y array de screenshots.

### `admin.controller.ts`

La función `importFromRawg(rawgSlug)`:
1. Llama a RAWG `/games/{slug}`
2. Crea el juego en la BD si no existe (usando `rawgId` como verificación)
3. Busca o crea géneros por nombre
4. Busca o crea plataformas por nombre
5. Asocia géneros y plataformas al juego
6. Guarda los primeros 12 tags de RAWG como string separado por comas

---

## Variables de entorno

Archivo `.env` en `Server/`:

```env
DB_HOST=db           # Host MySQL (usa 'db' con Docker, 'localhost' en local)
DB_USER=fkuser       # Usuario MySQL
DB_PASS=fkpass       # Contraseña MySQL
DB_NAME=fomokiller   # Nombre de la base de datos
PORT=3000            # Puerto del servidor
JWT_SECRET=...       # Secreto para firmar tokens JWT
RAWG_API_KEY=...     # API key de rawg.io
```

---

## Scripts de utilidad

| Script | Comando | Descripción |
|--------|---------|-------------|
| Servidor dev | `npm run dev` | Nodemon con ts-node |
| Build | `npm run build` | Compila TypeScript a JavaScript |
| Producción | `npm start` | Ejecuta el JS compilado |
| Importar juegos | `npm run import:rawg` | Importa lote de juegos desde RAWG |
| Actualizar devs | `npm run update:developer` | Rellena el campo developer desde RAWG |
| Crear admin | `npm run create:admin` | Crea un usuario con rol admin |
