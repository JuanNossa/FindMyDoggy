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

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('❌ Authentication error: Token missing'));
  try {
    socket.data.user = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    next();
  } catch {
    next(new Error('❌ Authentication error: Invalid token'));
  }
}

export function initChat(io: Server): void {
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Nuevo cliente conectado: ${socket.id}`);

    socket.on('joinRoom', async ({ fromId, toId }) => {
      const room = `${Math.min(fromId, toId)}_${Math.max(fromId, toId)}`;
      socket.join(room);
      console.log(`🚪 Socket ${socket.id} se unió a la sala: ${room}`);
      const history = await ChatMessage.findByRoom(room);
      socket.emit('chatHistory', history);
    });

    socket.on('chatMessage', async ({ fromId, toId, message }) => {
      const room = `${Math.min(fromId, toId)}_${Math.max(fromId, toId)}`;
      await ChatMessage.create(new ChatMessage(room, String(fromId), message));
      io.to(room).emit('chatMessage', { sender: fromId, message });
      console.log(`📨 Mensaje enviado a sala ${room}: ${message}`);
    });

    socket.on('disconnect', () => {
      console.log(`🚪 Cliente desconectado: ${socket.id}`);
    });
  });
}