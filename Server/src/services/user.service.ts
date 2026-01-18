import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/game.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/games', gameRoutes);

export default app;