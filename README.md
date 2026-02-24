# 🦍 FOMOKiller - Tu Gestor de Backlog Definitivo

FOMOKiller es una aplicación diseñada para gamers que sufren de "parálisis por análisis". Olvídate de mirar tu biblioteca de Steam durante horas sin saber a qué jugar. Explora, añade y gestiona tu backlog de forma brutal y sencilla.

## 🚀 Características Actuales

*   **🔍 Exploración Inteligente**: Buscador de juegos con *debounce* (para no saturar la API) y filtrado por colecciones temáticas (GOTYs, Indies, Soulslike, etc.).
*   **💎 Colecciones Curadas**: Parrilla de categorías con imágenes reales para descubrir tu próximo vicio.
*   **🕹️ Gestión de Backlog**: Clasifica los juegos en "Me gusta", "No me gusta" o "Completado".
*   **👤 Perfil de Usuario**: Personaliza tu bio y avatar para fardar de biblioteca.
*   **📱 Diseño "Brutalista" & Responsive**: Una interfaz limpia, directa y que se adapta a cualquier pantalla.
*   **📦 Modales Detallados**: Consulta toda la info de un juego (desarrollador, año, géneros) sin salir de la página.

## 🛠️ Stack Tecnológico

*   **Frontend**: React + TypeScript + Vanilla CSS (estilo premium).
*   **Backend**: Node.js + Express + TypeScript + Sequelize ORM.
*   **Base de Datos**: MySQL.
*   **Contenedores**: Docker + Docker Compose.

---

## 🏗️ Guía de Inicio Rápido

Tienes dos formas de hacer correr esta bestia:

### Opción A: Modo Local (Para desarrollo rápido)
1.  **Configura el entorno**: Abre `Server/.env` y asegúrate de tener estas variables:
    ```env
    DB_HOST=localhost
    DB_USER=root  # Tu usuario de MySQL local
    DB_PASS=tu_password
    ```
2.  **Instala y arranca**:
    *   **Server**: `cd Server && npm install && npm run dev`
    *   **Client**: `cd Client && npm install && npm run dev`

### Opción B: Modo Docker (Ideal para clase/despliegue) 🐳
1.  **Configura el entorno**: Cambia el `Server/.env` para que apunte al contenedor de la base de datos:
    ```env
    DB_HOST=db
    DB_USER=fkuser
    DB_PASS=fkpass
    ```
2.  **Lanza la magia**:
    Desde la raíz del proyecto corre:
    ```bash
    docker-compose up --build
    ```
    *   **Frontend**: [http://localhost:5173](http://localhost:5173)
    *   **Backend**: [http://localhost:3000](http://localhost:3000)

---

## 🔮 Lo que está por venir (Próximamente)

- [ ] **Sistema de Autenticación**: Registro y login real con JWT.
- [ ] **Sistema de Amigos**: Agrega a tus panas y mira a qué están jugando.
- [ ] **Chat en Tiempo Real**: Recomienda juegos directamente por mensaje privado.
 
---

## 🧹 Comandos de mantenimiento (Docker)

*   `docker-compose down -v`: Apaga todo y **limpia la base de datos** (por si quieres resetear el `init.sql`).
*   `docker ps`: Mira qué contenedores están vivos.

---
Hecho con 🦍 por **Tony1406**
