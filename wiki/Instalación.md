# Instalación y configuración

---

## Requisitos previos

- **Node.js** v18+ 
- **npm** v9+
- **MySQL** 8+ (o Docker)
- **Docker** + **Docker Compose** (para el setup con Docker)
- **Cuenta en RAWG** para obtener una API key gratuita: https://rawg.io/apidocs

---

## Opción A — Docker Compose (recomendado)

La forma más rápida de levantar todo el entorno.

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/FOMOKiller.git
cd FOMOKiller
```

### 2. Configurar variables de entorno del servidor

Crear el archivo `Server/.env`:

```env
DB_HOST=db
DB_USER=fkuser
DB_PASS=fkpass
DB_NAME=fomokiller
PORT=3000
JWT_SECRET=cambia_esto_por_algo_secreto
RAWG_API_KEY=tu_api_key_de_rawg
```

> `DB_HOST=db` hace referencia al servicio `db` definido en `docker-compose.yml`.

### 3. Levantar los servicios

```bash
docker-compose up --build
```

Esto levanta:
- **MySQL** en el puerto `3306`
- **Backend** Express en `http://localhost:3000`
- **Frontend** Vite en `http://localhost:5173`

La base de datos se crea automáticamente y Sequelize sincroniza las tablas al arrancar.

### 4. Crear un usuario admin

```bash
docker-compose exec server npm run create:admin
```

### 5. (Opcional) Importar juegos desde RAWG

```bash
docker-compose exec server npm run import:rawg
```

### Parar el entorno

```bash
docker-compose down          # Para los contenedores
docker-compose down -v       # Para + elimina la base de datos
```

---

## Opción B — Instalación manual

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/FOMOKiller.git
cd FOMOKiller
```

### 2. Base de datos MySQL

Crear la base de datos en tu instancia MySQL local:

```sql
CREATE DATABASE fomokiller;
CREATE USER 'fkuser'@'localhost' IDENTIFIED BY 'fkpass';
GRANT ALL PRIVILEGES ON fomokiller.* TO 'fkuser'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar el backend

```bash
cd Server
npm install
```

Crear `Server/.env`:

```env
DB_HOST=localhost
DB_USER=fkuser
DB_PASS=fkpass
DB_NAME=fomokiller
PORT=3000
JWT_SECRET=cambia_esto_por_algo_secreto
RAWG_API_KEY=tu_api_key_de_rawg
```

Arrancar el servidor:

```bash
npm run dev
```

El servidor escucha en `http://localhost:3000`. Sequelize crea y sincroniza las tablas automáticamente al arrancar.

### 4. Configurar el frontend

```bash
cd ../Client
npm install
npm run dev
```

El cliente estará disponible en `http://localhost:5173`.

### 5. Crear un usuario admin

```bash
cd Server
npm run create:admin
```

### 6. (Opcional) Importar juegos desde RAWG

```bash
npm run import:rawg
```

---

## Estructura de puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |
| MySQL | 3306 | localhost:3306 |

---

## Scripts disponibles

### Backend (`Server/`)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor con hot-reload (nodemon + ts-node) |
| `npm run build` | Compila TypeScript a JavaScript en `dist/` |
| `npm start` | Ejecuta el build compilado |
| `npm run create:admin` | Crea un usuario con rol `admin` |
| `npm run import:rawg` | Importa un lote de juegos desde RAWG API |
| `npm run update:developer` | Rellena el campo `developer` de juegos existentes |

### Frontend (`Client/`)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Dev server Vite en localhost:5173 |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview local del build de producción |
| `npm run lint` | Ejecuta ESLint |

---

## Solución de problemas comunes

### El backend no conecta a MySQL

- Verificar que MySQL esté corriendo y sea accesible en el host/puerto configurado
- Con Docker: asegurarse de que el servicio `db` esté sano antes de que arranque el servidor (hay un `depends_on` en el compose)
- Revisar usuario, contraseña y nombre de BD en `.env`

### Error de CORS

- El backend solo acepta peticiones de `http://localhost:5173`
- Si cambias el puerto del frontend, actualiza la configuración CORS en `Server/src/index.ts`

### JWT inválido / sesión perdida

- Las cookies son HttpOnly y solo se envían al mismo dominio
- Asegurarse de que el cliente use `credentials: 'include'` (ya está configurado en `api.ts`)
- Si cambias `JWT_SECRET` en `.env`, todas las sesiones existentes se invalidan

### RAWG API sin datos

- Verificar que `RAWG_API_KEY` esté correctamente configurado en `.env`
- La API de RAWG tiene un límite de peticiones gratuito; en uso intensivo puede ser necesario espaciar las importaciones

### Sequelize `sync({ alter: true })` falla

- Ocurre si hay cambios de tipo incompatibles entre el modelo y la tabla existente
- Solución temporal: hacer un `DROP TABLE` de la tabla problemática (ojo, se pierden los datos)
- En producción, usar migraciones Sequelize en lugar de `sync`
