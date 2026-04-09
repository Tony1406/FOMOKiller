import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import cookieParser from 'cookie-parser';


dotenv.config();


import { defineAssociations } from './models/associations.js';

import homeRoutes from './routes/home.routes.js';
import userRoutes from './routes/user.routes.js';
import myGamesRoutes from './routes/myGames.routes.js';
import exploreRoutes from './routes/explore.routes.js';
import rawgRoutes from './routes/rawg.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/home', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-games', myGamesRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/rawg', rawgRoutes);

const main = async () => {
    try {
        defineAssociations();
        console.log('Relaciones listas');
        await sequelize.sync({ alter: true });
        console.log('Base de datos lista');
        app.listen(PORT, () => {
            console.log(`Fomokiller Server ready at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

main();

export default app;