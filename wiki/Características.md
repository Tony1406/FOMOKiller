# Características y flujos de usuario

Esta sección describe los flujos principales de la aplicación desde la perspectiva del usuario, con detalle técnico de qué ocurre en cada paso.

---

## 1. Registro y primer acceso

```
/register → /login → /onboarding → /app/swipe
```

1. El usuario rellena el formulario de registro (username, email, contraseña)
2. El servidor hashea la contraseña con bcrypt (10 rounds) y crea el usuario
3. El usuario inicia sesión → el servidor emite un JWT en cookie HttpOnly
4. Como `hasCompletedOnboarding = false`, el login redirige a `/onboarding`
5. El usuario completa el wizard de 6 pasos (ver más abajo)
6. Al finalizar, se marca `hasCompletedOnboarding = true` y redirige a `/app/swipe`

---

## 2. Onboarding — Wizard de preferencias

El wizard recoge las preferencias del usuario para alimentar el algoritmo de recomendaciones. Tiene 6 pasos con animación de progreso.

```
Paso 1: Plataformas (multi-select)
  → PC, PlayStation 5, PlayStation 4, Xbox, Nintendo Switch, iOS, Android

Paso 2: Tiempo de sesión (single)
  → Ratitos (short) | Tardes (medium) | Horas sin parar (long)

Paso 3: Feeling (single)
  → Tensión | Story | Relax | Adrenalina | Build

Paso 4: Tipo de mundo (single)
  → Fantasy | Sci-fi | Horror | Open World | Realismo

Paso 5: Profundidad (single)
  → Casual | Complejo | Narrativo | Challenge

Paso 6: Rango de años (opcional)
  → Sliders min/max (por defecto: cualquier año)
```

Al completar el último paso:
- Se muestra una pantalla de carga con mensajes rotatorios
- Se llama a `POST /api/recommendations/preferences` con todos los datos
- Se actualiza el flag `hasCompletedOnboarding` en el usuario
- Redirect a `/app/swipe`

El usuario puede **rehacer el onboarding** desde su perfil (`/app/profile`), lo que recalcula sus recomendaciones desde cero.

---

## 3. Sistema de recomendaciones — Swipe

### Generación del deck

Al cargar `/app/swipe`:
1. Se comprueba `sessionStorage` — si ya hay un deck de esta sesión, se usa directamente (sin nueva petición)
2. Si no, se llama a `GET /api/recommendations/:userId`
3. El servidor ejecuta el algoritmo de filtrado por contenido y devuelve hasta **30 juegos** ordenados por relevancia

### Algoritmo (resumen técnico)

```
1. Leer UserPreference del usuario
2. Construir perfil textual:
   - Mapear feeling → términos de género ("story" → "rpg narrative adventure")
   - Mapear worldType → términos de mundo ("fantasy" → "wizard dragon magic")
   - Mapear depth → términos de complejidad ("casual" → "puzzle easy indie")
   - Mapear sessionLength → términos de duración ("long" → "immersive epic")
   - Si ignoreHistory=false: añadir géneros/tags/plataformas de los juegos LIKED

3. Obtener todos los juegos de la BD (con géneros, plataformas, tags)
4. Filtrar candidatos:
   - Excluir juegos ya en el backlog del usuario
   - Excluir juegos fuera del rango minYear–maxYear
   - Requerir que el juego esté disponible en al menos una plataforma del usuario

5. Construir documento de texto para cada candidato:
   - Nombres de géneros (lowercase)
   - Nombres de plataformas
   - Tags de RAWG (máx. 12)
   - Duración inferida del playtime

6. Entrenar modelo TF-IDF (content-based-recommender)
7. Devolver top 30 por similitud coseno con el perfil del usuario
```

### Interacción con las cartas

El usuario ve la carta del juego actual apilada sobre la siguiente (efecto de profundidad).

**Swipe derecha (LIKE):**
- Overlay azul + stamp "LIKE"
- Al soltar: animación fly-out a la derecha
- API: `PUT /api/my-games/status` con `status: 'LIKED'`
- El juego aparece en el backlog

**Swipe izquierda (PASS):**
- Overlay rojo + stamp "NOPE"
- Al soltar: animación fly-out a la izquierda
- API: `PUT /api/my-games/status` con `status: 'DISLIKED'`
- El juego no aparece en el backlog

**Botón info:**
- Abre `GameInfoModal` con detalles completos del juego
- Carga datos adicionales de RAWG API (screenshots, trailer, descripción completa)

**Botón atrás:**
- Retrocede al juego anterior (decrementa el índice)
- El estado del juego anterior se revierte

**Al agotar el deck:**
- Muestra pantalla "Has visto todo por ahora"
- Se puede resetear el historial desde el perfil para obtener nuevas recomendaciones

### Modos del algoritmo

Accesibles desde `/app/profile`:

| Modo | Comportamiento |
|------|----------------|
| Normal | Recomienda en base a preferencias + historial de likes |
| Exploración (`ignoreHistory=true`) | Ignora el historial, solo usa las preferencias del onboarding |
| Resetear historial | Establece `historyResetAt = ahora`, solo los likes a partir de ese momento influyen |

---

## 4. Exploración de colecciones

```
/app/explore → Colecciones → [click] → Juegos de la colección
            → Búsqueda → Resultados
```

### Colecciones
Las colecciones son grupos curados de juegos creados por administradores (GOTYs, Indies destacados, Clásicos, etc.). El usuario puede:
1. Ver el grid de colecciones
2. Hacer click en una colección para ver sus juegos
3. Cambiar entre vista lista, cards o swipe
4. Añadir juegos al backlog directamente

### Búsqueda
- Campo de búsqueda con debounce de 300ms
- Busca en el catálogo local por título (LIKE %query%)
- Muestra resultados paginados (18 por página)
- Los juegos ya en el backlog aparecen marcados

---

## 5. Gestión del Backlog

```
/app/backlog → Filtrar → Ordenar → [lista | cards | swipe]
```

El backlog muestra todos los juegos con estado `LIKED`, `COMPLETED`, o `isPriority`.

### Filtros

| Pestaña | Condición |
|---------|-----------|
| Todos | Todos excepto DISLIKED/DROPPED |
| Pendientes | LIKED + no completados |
| Completados | `isFinished = true` |
| Top 5 | `isPriority = true` |

### Ordenación

| Opción | Campo |
|--------|-------|
| Recientes | Fecha de adición (DESC) |
| Antiguos | Fecha de adición (ASC) |
| A-Z | Título (ASC) |
| Z-A | Título (DESC) |
| Año ↑ | `releaseYear` (ASC) |
| Año ↓ | `releaseYear` (DESC) |

### Acciones por juego

- **✓ Completar**: marca `isFinished = true`, mueve a pestaña "Completados"
- **★ Top 5**: añade a prioridades (máx. 5). Si ya hay 5, el botón se deshabilita
- **🗑 Eliminar**: elimina del backlog (con modal de confirmación)
- **Ver detalles**: abre `GameInfoModal`

### Modo swipe en el backlog
Al activar el modo swipe desde el toggle de vistas:
- Los juegos del filtro activo se presentan como deck de cartas
- El botón "atrás" en la barra superior restaura el modo de vista anterior (lista o cards)
- El swipe derecha marca como completado, izquierda elimina del backlog

### Vaciar backlog
Botón con modal de confirmación que elimina todos los juegos del backlog (excepto DISLIKED).

---

## 6. Top 5 — Juegos prioritarios

```
/app/top5 → Ver prioridades → Reordenar (drag) → Marcar completado / Quitar
```

El Top 5 es una lista de hasta 5 juegos que el usuario considera sus prioridades actuales.

### Gestión
- **Añadir**: desde el backlog, haciendo click en la estrella (★)
- **Reordenar**: drag & drop directo en la página Top5. Al soltar, se llama a `PUT /api/my-games/priorities/reorder` con el nuevo orden
- **Marcar completado**: el juego se mueve a completados y se elimina del Top 5
- **Quitar del Top 5**: el juego vuelve al backlog sin perder su historial

Los slots vacíos se muestran visualmente como placeholders con número de posición.

---

## 7. Perfil de usuario

```
/app/profile → Ver stats → Editar perfil → Gestionar recomendaciones → Logout
```

### Información mostrada
- Avatar, nombre, bio
- Número de juegos completados
- Fecha de registro ("miembro desde")
- Plataformas preferidas (del onboarding)
- Juego #1 del Top 5

### Editar perfil
Modal que permite actualizar:
- Nombre de usuario
- Email
- Bio
- URL del avatar

### Controles de recomendaciones

| Acción | Efecto |
|--------|--------|
| Activar modo exploración | `PATCH /preferences/:userId/toggle-exploration` — `ignoreHistory = !ignoreHistory` |
| Resetear historial | `PATCH /preferences/:userId/reset-history` — `historyResetAt = now()` |
| Rehacer onboarding | Navega a `/onboarding` |

---

## 8. Panel de administración

```
/admin → Usuarios | Juegos | Colecciones
```

Accesible solo con `role: 'admin'`. Permite gestionar el contenido de la plataforma.

### Gestión de juegos

**Opción A — Creación manual:**
- Formulario con todos los campos del modelo `Game`
- Selección de plataformas disponibles

**Opción B — Importar desde RAWG:**
1. Buscar por nombre en RAWG (buscador con paginación)
2. Seleccionar el juego deseado
3. El servidor importa automáticamente:
   - Datos básicos (título, descripción, año, developer, imagen)
   - Géneros (crea los que no existen)
   - Plataformas (crea las que no existen)
   - Tags (primeros 12 de RAWG)
4. El juego queda disponible para todos los usuarios

### Gestión de colecciones
- Crear/editar/eliminar colecciones
- Añadir o quitar juegos de una colección mediante buscador

### Gestión de usuarios
- Listar todos los usuarios
- Cambiar rol (user ↔ admin)
- Editar perfil (incluyendo contraseña)
- Eliminar cuenta

---

## 9. GameInfoModal — Detalles de juego

Disponible desde SwipePage, ExplorePage y BacklogPage pulsando el botón de información.

**Datos locales** (de la BD):
- Título, géneros, plataformas disponibles, año

**Datos de RAWG** (cargados al abrir el modal):
- Descripción completa con toggle "Ver más / Ver menos"
- Desarrollador y publisher
- Rating ESRB
- Duración media
- Website oficial (link externo)
- Trailer (iframe embebido)
- Galería de screenshots (carrusel con teclado ← →)

El modal se cierra con `Escape` o `Enter`.
