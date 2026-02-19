import express from 'express';
import cors from 'cors';
import { sequelize } from './config/db.js';

import { defineAssociations } from './models/associations.js';

import homeRoutes from './routes/home.routes.js';
import userRoutes from './routes/user.routes.js';
import myGamesRoutes from './routes/myGames.routes.js';
import exploreRoutes from './routes/explore.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/home', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-games', myGamesRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/chat', chatRoutes);

// ARRANQUE DEL SERVIDOR
const main = async () => {
    try {
        defineAssociations();
        console.log('Relaciones entre modelos establecidas.');
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada (12 Modelos listos).');
        app.listen(PORT, () => {
            console.log(`Fomokiller Server ready at http://localhost:${PORT}`);
            console.log(`Endpoints disponibles en /api/home, /api/users, etc.`);
        });

    } catch (error) {
        console.error('Error fatal al iniciar el servidor:', error);
    }
};

main();

export default app;