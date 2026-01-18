import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/game.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Fomokiller Server ready at http://localhost:${PORT}`);
});