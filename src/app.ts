// src/app.ts

/**
 * Archivo principal de configuración de la aplicación Express.
 * Se configuran los middlewares, rutas y se exporta la aplicación.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Agregar middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());

// Importar rutas
import testRoutes from './infrastructure/routes/testRoutes';
import authRoutes from './infrastructure/routes/AuthRoutes';
import publicationRoutes from './infrastructure/routes/PublicationRoutes';
import walletRoutes from './infrastructure/routes/WalletRoutes';
import commentRoutes from './infrastructure/routes/CommentRoutes';
import notificationRoutes from './infrastructure/routes/NotificationRoutes';
import uploadRoutes from './infrastructure/routes/uploadRoutes';
import chatRoutes from './infrastructure/routes/ChatRoutes';
import userRoutes from './infrastructure/routes/UserRoutes';

// Montar rutas
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a FindMyDoggy API');
});

export default app;
