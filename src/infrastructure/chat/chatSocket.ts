// src/infrastructure/chat/chatSocket.ts

/**
 * Módulo para configurar y manejar eventos del chat usando Socket.IO.
 * Se valida el token JWT en el handshake para asegurar que solo usuarios autenticados se conecten.
 * Además, se guarda cada mensaje en la base de datos (historial de chat).
 */

import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ChatMessage } from '../../domain/models/ChatMessage';

dotenv.config();

/**
 * Middleware para validar JWT en el handshake de Socket.IO.
 */
export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'secretKey') as any;
    // Guardar la información del usuario en socket.data
    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
}

/**
 * Inicializa el chat y maneja los eventos.
 * @param io Instancia del servidor Socket.IO.
 */
export function initChat(io: Server): void {
  // Usar el middleware de autenticación para Socket.IO
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: Socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}, usuario: ${JSON.stringify(socket.data.user)}`);

    // Evento para que un usuario se una a una sala
    socket.on('joinRoom', async (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} se unió a la sala: ${room}`);
      io.to(room).emit('chatMessage', { sender: 'Sistema', message: `El usuario ${socket.data.user.userId} se ha unido a la sala.` });
      
      // Opcional: enviar el historial de chat
      const history = await ChatMessage.findByRoom(room);
      socket.emit('chatHistory', history);
    });

    // Evento para recibir un mensaje de chat
    socket.on('chatMessage', async (data: { room: string; sender: string; message: string }) => {
      console.log(`Mensaje recibido de ${data.sender} en sala ${data.room}: ${data.message}`);
      // Guardar el mensaje en la base de datos
      await ChatMessage.create(new ChatMessage(data.room, data.sender, data.message));
      // Emitir el mensaje a todos los clientes de la sala
      io.to(data.room).emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
}