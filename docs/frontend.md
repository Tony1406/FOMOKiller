# Frontend — React App

El frontend está construido con **React 19** + **TypeScript** + **Vite**. Es una SPA (Single Page Application) con navegación client-side mediante React Router 7.

---

## Estructura de rutas

Definida en `Client/src/App.tsx`:

```
/ (LandingLayout)
├── /                  → HomePage
├── /mision            → MissionPage
├── /descarga          → DownloadPage
├── /contacto          → ContactPage
├── /login             → LoginPage
└── /register          → RegisterPage

/admin (AdminRoute — requiere role: 'admin')
├── /admin             → redirect → /admin/usuarios
├── /admin/usuarios    → AdminUsuarios
├── /admin/juegos      → AdminJuegos
└── /admin/colecciones → AdminColecciones

/onboarding (ProtectedRoute — requiere autenticación)
└── /onboarding        → OnboardingPage

/app (ProtectedRoute + AppLayout)
├── /app               → redirect → /app/swipe
├── /app/swipe         → SwipePage
├── /app/explore       → ExplorePage
├── /app/backlog       → BacklogPage
├── /app/top5          → Top5Page
└── /app/profile       → ProfilePage
```

---

## Layouts

### `AppLayout`
Envuelve todas las páginas de la app autenticada. Renderiza:
- `<Navbar />` — Barra lateral izquierda con navegación
- `<Header />` — Cabecera solo en móvil
- `<UserChip />` — Chip de usuario fijo en la esquina superior derecha (solo desktop, oculto en `/app/profile`)
- `<Outlet />` — Contenido de la página actual

El fondo animado Aurora se configura en la propia ruta `/app` en `App.tsx`.

### `LandingLayout`
Layout para las páginas públicas. Incluye:
- Fondo animado `PrismaticBurst` (WebGL)
- Scanlines overlay y vignette para estética retro PS2
- Navbar de landing con logo y links
- Menú hamburguesa en móvil
- Footer con links a redes sociales

### `AdminLayout`
Layout del panel de administración. Incluye:
- Sidebar con navegación (Usuarios, Juegos, Colecciones)
- Chip de usuario admin con avatar y botón de logout

---

## Contexto de autenticación

**Archivo:** `Client/src/context/AuthContext.tsx`

Proporciona el estado de autenticación a toda la app. Se inicializa haciendo una petición a `/api/users/me` para recuperar el usuario de la cookie existente.

**Valor del contexto:**
```typescript
{
  user: {
    id: number
    username: string
    email: string
    role: 'user' | 'admin'
    hasCompletedOnboarding: boolean
    avatarUrl?: string
    bannerUrl?: string
    bio?: string
  } | null
  setUser: (user) => void
  logout: () => Promise<void>
  loading: boolean
}
```

**Hook:** `useAuth()` — Permite acceder al contexto desde cualquier componente.

---

## Guards de ruta

### `ProtectedRoute`
Redirige a `/login` si el usuario no está autenticado. Mientras se comprueba el estado de auth (loading), no renderiza nada.

### `AdminRoute`
Verifica que `user.role === 'admin'`. Si el usuario es normal, redirige a `/login`.

---

## Páginas de la app

### SwipePage (`/app/swipe`)

Interfaz principal de descubrimiento de juegos mediante swipe.

**Funcionamiento:**
- Carga las recomendaciones personalizadas desde `/api/recommendations/:userId`
- Las persiste en `sessionStorage` para no repetir la carga en navegaciones
- Muestra una pila de cartas donde la carta frontal es interactiva

**Controles:**
- **Arrastrar** con mouse/touch: superar 90px de umbral activa el swipe
- **Teclado:** `←` DISLIKED, `→` LIKED, `↑` abrir info, `↓` retroceder
- **Botones:** Pass (X), Like (corazón), Info (i), Atrás (flecha)

**Animaciones:**
- Rotación proporcional al drag (`deltaX / 18` grados)
- Overlay de color al arrastrar (azul = LIKED, rojo = DISLIKED)
- Stamps "LIKE" / "NOPE" con opacidad progresiva
- Fly-out animado al confirmar swipe

**Estado:**
- `juegos[]` — Deck de recomendaciones
- `idJuego` — Índice de la carta actual
- `dragX` — Distancia horizontal del drag activo
- `flyOut` — Estado de la animación de salida (`null | 'left' | 'right'`)
- `mostrarInfo` — Si el modal de detalles está abierto

---

### ExplorePage (`/app/explore`)

Exploración de colecciones curadas y búsqueda de juegos.

**Secciones:**
1. **Grid de colecciones** — Al hacer click, muestra los juegos de esa colección
2. **Barra de búsqueda** — Con debounce de 300ms, busca en el catálogo local
3. **Vista de juegos** — Lista, grid de cards, o modo swipe

**Modos de vista:** `lista` | `cards` | `swipe` (persistido en `localStorage`)

**Acciones en cada juego:**
- Añadir al backlog (LIKED)
- Ver detalles (abre GameInfoModal)
- Feedback visual tipo toast al añadir

**Estado clave:**
- `colecciones[]` — Todas las colecciones
- `coleccionSeleccionada` — Colección actualmente vista
- `buscarResultados[]` — Resultados de búsqueda
- `enBacklog` — Set de IDs de juegos ya en el backlog del usuario

---

### BacklogPage (`/app/backlog`)

Gestión del backlog personal del usuario.

**Pestañas de filtro:**
- Todos
- Pendientes (LIKED, no completados)
- Completados (isFinished)
- Top 5 (isPriority)

**Opciones de ordenación:**
- Recientes / Antiguos (por fecha de adición)
- A-Z / Z-A (por título)
- Año ↑ / Año ↓ (por año de lanzamiento)

**Modos de vista:** `lista` | `cards` | `swipe`

Al activar el modo swipe, aparece un botón de retroceso en la barra para volver al modo anterior. La lógica usa un ref (`prevVistaRef`) para recordar si el usuario venía de lista o cards.

**Acciones en cada juego:**
- ✓ Marcar como completado
- ★ Añadir/quitar del Top 5 (máximo 5)
- 🗑 Eliminar del backlog (con confirmación)
- Botón "Vaciar backlog" (con confirmación)

---

### Top5Page (`/app/top5`)

Gestión de los 5 juegos prioritarios del usuario.

**Funcionalidades:**
- Muestra hasta 5 slots (los vacíos se muestran con placeholder)
- **Drag & drop** para reordenar (actualiza `priority_order` en BD)
- Marcar como completado (quita del Top 5)
- Quitar del Top 5 (con confirmación)

**Modos de vista:** `lista` | `cards`

**Lógica de drag:**
- `dragIndexRef` — Índice de origen del drag
- `dragOverIndex` — Índice de destino (hover)
- Al soltar, reordena el array localmente y llama a `reorderPriorities`

---

### ProfilePage (`/app/profile`)

Perfil personal del usuario.

**Información mostrada:**
- Avatar, nombre de usuario, bio
- Estadísticas: juegos completados, miembro desde, plataformas preferidas
- Juego #1 del Top 5
- Preferencias del onboarding

**Controles de recomendaciones:**
- **Modo exploración** (toggle): ignora el historial de likes para recibir recomendaciones más diversas
- **Resetear historial**: solo considera likes a partir de ahora
- **Rehacer onboarding**: vuelve al wizard de preferencias

**Modal de edición de perfil:**
- Cambiar username, email, bio y URL del avatar

---

### OnboardingPage (`/onboarding`)

Wizard de 6 pasos para configurar las preferencias del usuario.

**Pasos:**

| Paso | Pregunta | Tipo | Opciones |
|------|----------|------|---------|
| 1 | ¿En qué plataformas juegas? | Multi-select | PC, PS5, PS4, Xbox, Switch, iOS, Android |
| 2 | ¿Cuánto tiempo tienes para jugar? | Single-select | Ratitos, Tardes, Horas sin parar |
| 3 | ¿Cómo quieres sentirte? | Single-select | Tensión, Story, Relax, Adrenalina, Build |
| 4 | ¿Qué tipo de mundo prefieres? | Single-select | Fantasy, Sci-fi, Horror, Open World, Realismo |
| 5 | ¿Qué tan profundo quieres ir? | Single-select | Casual, Complejo, Narrativo, Challenge |
| 6 | ¿Rango de años? | Sliders opcionales | min/max year |

Al completar el wizard:
1. Muestra animación de guardado con mensajes rotatorios
2. Llama a `savePreferences`
3. Actualiza `hasCompletedOnboarding` en el usuario
4. Redirige a `/app/swipe`

---

### LoginPage y RegisterPage

**Login:** Formulario email + contraseña. Al autenticarse correctamente:
- Si `role === 'admin'` → redirige a `/admin`
- Si `!hasCompletedOnboarding` → redirige a `/onboarding`
- En otro caso → redirige a `/app`

**Register:** Formulario username + email + contraseña (mín. 6 caracteres). Tras el registro redirige al login.

---

## Componentes reutilizables

### `Navbar`
Barra de navegación lateral para desktop. Links con iconos SVG personalizados:
- Swipe (icono de fuego)
- Explorar
- Backlog
- Top 5
- Perfil
- Logout (icono en la parte inferior)

En móvil está oculta y se usa `Header` en su lugar.

### `Header`
Cabecera visible solo en móvil. Muestra el logo y el usuario activo.

### `UserChip`
Chip fijo en la esquina superior derecha de la app (solo en desktop, `min-width: 768px`). Muestra avatar circular y nombre del usuario. Es un link a `/app/profile`. Se oculta cuando el usuario ya está en la página de perfil.

### `GameInfoModal`

Modal completo con detalles de un juego. Recibe el juego como prop y carga datos adicionales de RAWG API.

**Contenido:**
- Carrusel de imágenes (portada + screenshots de RAWG)
- Géneros como tags
- Tabla de info: Desarrollador, Publisher, Año, Duración, ESRB
- Iconos de plataformas disponibles
- Descripción con botón "Ver más"
- Iframe del trailer (si existe)
- Link a web oficial

**Controles de teclado:**
- `←` / `→` — Navegar carrusel
- `Escape` / `Enter` — Cerrar modal

### `SwipeView`

Componente reutilizable de swipe embebible. Lo usan `ExplorePage` y `BacklogPage` para activar el modo swipe desde sus propias páginas. Tiene la misma mecánica de arrastre y animaciones que `SwipePage`, pero acepta los juegos por props y expone callbacks para las acciones.

Incluye un botón "extra" configurable (por ejemplo, en BacklogPage añade la posibilidad de poner en Top 5 al hacer swipe arriba).

### `Paginador`

Componente de paginación genérico con:
- Botones anterior/siguiente
- Input de número de página
- Total de páginas

Recibe `page`, `totalPages` y `onChange` como props.

### `ConfirmModal`

Modal de confirmación reutilizable. Usado para acciones destructivas (vaciar backlog, eliminar juego). Props: `title`, `description`, `onConfirm`, `onClose`. Variante `danger` usa estilos rojos.

### `EditProfileModal`

Modal para editar el perfil del usuario. Campos: username, email, bio, avatar URL. Llama a `updateUserProfile` al guardar.

### `Aurora` y `PrismaticBurst`

Fondos animados basados en WebGL con Three.js (`@react-three/fiber`):
- **Aurora**: efecto de aurora boreal con malla de triángulos distorsionada. Acepta `colorStops`, `amplitude`, `blend`, `speed`.
- **PrismaticBurst**: efecto de explosión prismática para la landing. Estética PS2/retro.

---

## Servicio API (`services/api.ts`)

Cliente centralizado para todas las peticiones al backend. Todas las funciones incluyen `credentials: 'include'` para enviar cookies automáticamente.

**Base URL:** `http://localhost:3000/api`

**Agrupación de funciones:**

| Grupo | Funciones principales |
|-------|-----------------------|
| Auth | `login`, `register`, `logout` |
| Perfil | `getUserProfile`, `updateUserProfile` |
| Juegos | `getAllGames`, `getGameDetails` |
| Backlog | `getBacklog`, `updateStatus`, `markFinished`, `clearBacklog` |
| Top 5 | `getPriorities`, `setPriority`, `reorderPriorities` |
| Explorar | `getCollections`, `getCollectionGames`, `searchGames` |
| Recomendaciones | `getRecommendations`, `savePreferences`, `getPreferences`, `toggleExploration`, `resetRecommendationHistory` |
| Admin | Funciones CRUD para usuarios, juegos y colecciones |

---

## Variables CSS globales

Definidas en `Client/src/index.css`. Se usan en toda la app:

```css
--cobalt             /* Color azul principal (#0070f3) */
--cobalt-light       /* Azul claro */
--pass               /* Color de rechazo (rojo) */
--pass-glow          /* Glow rojo con transparencia */
--shadow-cobalt      /* Box-shadow azul */
--bg-card            /* Fondo de tarjeta */
--text-primary       /* Texto principal */
--text-secondary     /* Texto secundario */
--radius-lg          /* Border-radius grande */
--radius-md          /* Border-radius medio */
--radius-sm          /* Border-radius pequeño */
--t-base             /* Duración de transición base */
--ease-spring        /* Easing tipo spring */
--ease-smooth        /* Easing suave */
```

---

## Scripts del cliente

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite dev server en `localhost:5173` |
| `npm run build` | Compila y optimiza para producción en `dist/` |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Preview del build de producción |
