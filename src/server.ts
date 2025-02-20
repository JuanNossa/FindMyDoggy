// src/server.ts

/**
 * Archivo principal para iniciar el servidor de la aplicación.
 * Se crea un servidor HTTP a partir de la aplicación Express,
 * se integra Socket.IO y se inicializa el módulo de chat.
 */

import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { initChat } from './infrastructure/chat/chatSocket';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Crear el servidor HTTP usando la aplicación Express
const server = http.createServer(app);

// Inicializar Socket.IO con opciones de CORS (para desarrollo, se permite cualquier origen)
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Inicializar el chat con la instancia de Socket.IO
initChat(io);

// Iniciar el servidor HTTP
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});