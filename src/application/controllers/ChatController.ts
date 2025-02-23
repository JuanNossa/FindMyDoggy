// 📂 src/application/controllers/ChatController.ts
import { Request, Response } from 'express';
import { ChatMessage } from '../../domain/models/ChatMessage';

export class ChatController {
  /**
   * Crea o reutiliza una sala entre dos usuarios.
   */
  static async createRoom(fromId: number, toId: number): Promise<string> {
    const minId = Math.min(fromId, toId);
    const maxId = Math.max(fromId, toId);
    const room = `${minId}_${maxId}`;
    return room;
  }

  /**
   * Obtiene todas las salas en las que participa un usuario.
   */
  static async getUserChats(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.query.userId);
      if (!userId) {
        res.status(400).json({ message: 'Falta userId' });
        return;
      }

      const rooms = await ChatMessage.findRoomsByUser(userId);
      res.json({ chats: rooms });
    } catch (error: any) {
      console.error('❌ Error en ChatController.getUserChats:', error);
      res.status(500).json({ error: error.message });
    }
  }
}