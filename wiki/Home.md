# FOMOKiller — Wiki

Bienvenido a la wiki del proyecto **FOMOKiller**, una aplicación web de gestión de backlog de videojuegos con recomendaciones personalizadas.

---

## Navegación

| Página | Descripción |
|--------|-------------|
| [[Arquitectura]] | Stack tecnológico, estructura de carpetas, patrones de diseño |
| [[Base-de-datos]] | Modelos, relaciones, esquema completo |
| [[Backend]] | API REST, rutas, controladores, autenticación |
| [[Frontend]] | Páginas, componentes, routing, contextos |
| [[Características]] | Flujos de usuario: swipe, backlog, top 5, recomendaciones |
| [[Instalación]] | Cómo levantar el proyecto en local o con Docker |

---

## Resumen rápido

**FOMOKiller** elimina la parálisis de análisis del gamer: en lugar de pasarse horas buscando qué jugar, el sistema aprende tus gustos y te presenta juegos uno a uno para que decidas rápido.

```
Registro → Onboarding (preferencias) → Swipe de recomendaciones → Backlog → Top 5
```

### Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Express 5 + TypeScript |
| ORM | Sequelize 6 |
| Base de datos | MySQL |
| Datos de juegos | RAWG API |
| Despliegue | Docker Compose |
| Recomendaciones | TF-IDF + Cosine Similarity |
