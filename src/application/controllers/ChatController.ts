// src/application/controllers/ChatController.ts

import { Request, Response } from 'express';
import { ChatMessage } from '../../domain/models/ChatMessage';

export class ChatController {
  /**
   * Retorna las salas (rooms) en las que participa un usuario,
   * basándonos en los mensajes que ha enviado o recibido.
   */
  static async getUserChats(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.query.userId);
      if (!userId) {
        res.status(400).json({ message: 'Falta userId' });
        return;
      }
      // Obtener las rooms de chat_messages donde el sender sea userId o donde la sala se asocie a userId
      // En una implementación real, deberías tener otra tabla para las salas. Aquí, un approach simplificado:
      const rooms = await ChatMessage.findRoomsByUser(userId);
      res.json({ chats: rooms });
    } catch (error: any) {
      console.error('Error en ChatController.getUserChats:', error);
      res.status(500).json({ error: error.message });
    }
  }
}