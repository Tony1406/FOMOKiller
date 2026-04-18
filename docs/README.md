# FOMOKiller — Documentación

FOMOKiller es una aplicación web de gestión de backlog de videojuegos diseñada para eliminar la parálisis de análisis. Combina un sistema de recomendaciones personalizadas, organización del backlog y exploración de colecciones curadas.

---

## Índice

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](architecture.md) | Visión general del sistema, stack tecnológico y estructura de carpetas |
| [Base de datos](database.md) | Modelos, relaciones, esquema completo |
| [Backend](backend.md) | API REST, rutas, controllers, autenticación |
| [Frontend](frontend.md) | Páginas, componentes, routing, contextos |
| [Características](features.md) | Flujos de usuario: swipe, backlog, top 5, recomendaciones |
| [Instalación](setup.md) | Cómo levantar el proyecto en local o con Docker |

---

## Resumen rápido

```
Usuario → Onboarding (preferencias) → Swipe de recomendaciones → Gestión de backlog → Top 5
```

**Stack:**
- Frontend: React 19 + TypeScript + Vite
- Backend: Express 5 + TypeScript
- ORM: Sequelize
- Base de datos: MySQL
- Datos de juegos: RAWG API
- Despliegue: Docker Compose
