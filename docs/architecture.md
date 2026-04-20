# Arquitectura del sistema

## Visión general

FOMOKiller sigue una arquitectura cliente-servidor clásica con una base de datos relacional. El frontend y el backend están completamente desacoplados y se comunican a través de una API REST. La autenticación se gestiona mediante JWT almacenado en cookies HttpOnly.

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENTE                           │
│              React 19 + TypeScript + Vite               │
│                   localhost:5173                        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST (credentials: include)
                           │ Cookie: fomokiller_token
┌──────────────────────────▼──────────────────────────────┐
│                       SERVIDOR                          │
│              Express 5 + TypeScript + Node 22             │
│                   localhost:3000                        │
│                                                         │
│  Middleware: CORS, cookieParser, express.json           │
│  Auth: JWT (7 días, HttpOnly cookie)                    │
│  ORM: Sequelize 6                                       │
└──────────────────────────┬──────────────────────────────┘
                           │ Sequelize ORM
┌──────────────────────────▼──────────────────────────────┐
│                    BASE DE DATOS                        │
│                   MySQL (port 3306)                     │
│              11 tablas + 5 tablas de unión              │
└─────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    API EXTERNA                          │
│                   RAWG.io API                           │
│     Datos de juegos: detalles, screenshots, trailers    │
└─────────────────────────────────────────────────────────┘
```

---

## Stack tecnológico

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.2.0 | Framework UI |
| TypeScript | ~5.9.3 | Tipado estático |
| Vite | 7.2.4 | Build tool y dev server |
| React Router | 7.13.0 | Navegación SPA |
| Three.js | 0.183.2 | Fondos animados WebGL |
| @react-three/fiber | 9.5.0 | React + Three.js |
| Lucide React | 0.577.0 | Iconos |
| Radix UI | 1.4.3 | Componentes headless accesibles |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Express | 5.2.1 | Framework web |
| TypeScript | — | Tipado estático |
| Sequelize | 6.37.7 | ORM |
| mysql2 | 3.16.1 | Driver MySQL |
| bcrypt | 6.0.0 | Hash de contraseñas |
| jsonwebtoken | 9.0.3 | Tokens JWT |
| cookie-parser | 1.4.7 | Parseo de cookies |
| cors | 2.8.5 | CORS headers |
| content-based-recommender | 1.5.0 | Algoritmo TF-IDF para recomendaciones |
| dotenv | 17.2.3 | Variables de entorno |

---

## Estructura de carpetas

```
FOMOKiller/
├── Client/                        # Aplicación React
│   ├── public/                    # Assets estáticos
│   └── src/
│       ├── App.tsx                # Configuración de rutas
│       ├── main.tsx               # Entry point
│       ├── index.css              # Variables CSS globales y reset
│       ├── App.css                # Estilos base de la app
│       ├── assets/                # Imágenes, SVGs, iconos
│       ├── components/            # Componentes reutilizables
│       │   ├── Background/        # Animaciones Aurora y PrismaticBurst (WebGL)
│       │   ├── modals/            # Modales: GameInfo, EditProfile, Confirm
│       │   ├── Navbar.tsx         # Barra lateral de navegación
│       │   ├── Header.tsx         # Cabecera móvil
│       │   ├── UserChip.tsx       # Chip de usuario (desktop)
│       │   ├── ProtectedRoute.tsx # Guard para rutas autenticadas
│       │   ├── AdminRoute.tsx     # Guard para rutas de admin
│       │   ├── SwipeView.tsx      # Componente swipe embebible
│       │   └── Paginador.tsx      # Paginación
│       ├── context/
│       │   └── AuthContext.tsx    # Estado global de autenticación
│       ├── layouts/               # Wrappers de layout por sección
│       │   ├── AppLayout.tsx      # Layout app autenticada
│       │   ├── LandingLayout.tsx  # Layout landing pública
│       │   └── AdminLayout.tsx    # Layout panel de admin
│       ├── pages/
│       │   ├── App/               # Páginas de la app autenticada
│       │   │   ├── SwipePage.tsx
│       │   │   ├── ExplorePage.tsx
│       │   │   ├── BacklogPage.tsx
│       │   │   ├── Top5Page.tsx
│       │   │   └── ProfilePage.tsx
│       │   ├── Admin/             # Páginas de administración
│       │   │   ├── AdminUsuarios.tsx
│       │   │   ├── AdminJuegos.tsx
│       │   │   └── AdminColecciones.tsx
│       │   ├── Auth/              # Login y registro
│       │   │   ├── login.tsx
│       │   │   └── register.tsx
│       │   ├── Landing/           # Páginas públicas
│       │   │   ├── HomePage.tsx
│       │   │   ├── MissionPage.tsx
│       │   │   ├── DownloadPage.tsx
│       │   │   └── ContactPage.tsx
│       │   └── Onboarding/
│       │       └── OnboardingPage.tsx   # Wizard de preferencias
│       └── services/
│           └── api.ts             # Cliente API centralizado
│
├── Server/                        # API Express
│   └── src/
│       ├── index.ts               # Entry point, middleware, rutas
│       ├── config/
│       │   └── db.ts              # Configuración Sequelize
│       ├── models/                # Modelos de base de datos
│       │   ├── UserModel.ts
│       │   ├── UserPreferenceModel.ts
│       │   ├── GameModel.ts
│       │   ├── UserGameModel.ts
│       │   ├── GenreModel.ts
│       │   ├── GameGenreModel.ts
│       │   ├── PlatformModel.ts
│       │   ├── GamePlatformModel.ts
│       │   ├── UserPlatformModel.ts
│       │   ├── CollectionModel.ts
│       │   ├── CollectionGameModel.ts
│       │   └── associations.ts    # Definición de relaciones
│       ├── controllers/           # Lógica de negocio
│       │   ├── user.controller.ts
│       │   ├── home.controller.ts
│       │   ├── explore.controller.ts
│       │   ├── myGames.controller.ts
│       │   ├── rawg.controller.ts
│       │   ├── recommendations.controller.ts
│       │   └── admin.controller.ts
│       ├── routes/                # Definición de rutas
│       │   ├── user.routes.ts
│       │   ├── home.routes.ts
│       │   ├── explore.routes.ts
│       │   ├── myGames.routes.ts
│       │   ├── rawg.routes.ts
│       │   ├── recommendations.routes.ts
│       │   └── admin.routes.ts
│       ├── middleware/
│       │   └── requireAdmin.ts    # Middleware de autorización admin
│       └── scripts/               # Scripts de utilidad
│           ├── importFromRawg.ts  # Importar juegos desde RAWG
│           ├── updateDeveloper.ts # Actualizar datos de desarrollador
│           └── createAdmin.ts     # Crear usuario admin
│
└── docker-compose.yml             # Orquestación de servicios
```

---

## Patrones de diseño

### Backend: MVC
El servidor sigue el patrón Modelo-Vista-Controlador adaptado a una API REST:
- **Modelos** (`/models`): definen la estructura de datos y relaciones con Sequelize
- **Controladores** (`/controllers`): contienen la lógica de negocio
- **Rutas** (`/routes`): conectan endpoints HTTP con los controladores

### Frontend: Component-Based + Context
- Componentes React reutilizables con separación clara entre UI y lógica
- Context API (`AuthContext`) para estado global de autenticación
- Custom hook `useAuth()` para acceder al contexto desde cualquier componente
- `sessionStorage` para persistir el deck de recomendaciones entre navegaciones

### Autenticación
- JWT firmado con `JWT_SECRET` (expiración: 7 días)
- Almacenado en cookie HttpOnly (`fomokiller_token`) para protección XSS
- El cliente incluye `credentials: 'include'` en todas las peticiones
- CORS configurado con `origin` explícito + `credentials: true`
