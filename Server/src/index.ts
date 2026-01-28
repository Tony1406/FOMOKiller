import express from 'express';
import cors from 'cors';
import { sequelize } from './config/db.js';

// Modelos (Solo para registrar en Sequelize)
import './models/UserModel.js';
import './models/GameModel.js';

// Rutas
import gameRoutes from './routes/home.routes.js';
import userRoutes from './routes/user.routes.js';


const app = express();
const PORT = process.env.PORT || 3000; // Siempre ten un fallback por seguridad

// Middlewares
app.use(cors());
app.use(express.json());


// Rutas
app.use('/api/home', gameRoutes);
app.use('/api/admin', userRoutes);

// Arranque del Servidor
sequelize.sync({ alter: true }) // alter: true -> actualiza la tabla si existe, si no existe la crea
    .then(() => {
        console.log('✅ Base de datos sincronizada');
        app.listen(PORT, () => { // Arranco el servidor
            console.log(`🚀 Fomokiller Server ready at http://localhost:${PORT}`); // Mensaje de bienvenida
        });
    })
    .catch((error) => {
        console.error('❌ Error al sincronizar la base de datos:', error);
    });

export default app;
