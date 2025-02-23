// src/domain/models/ChatMessage.ts

/**
 * Modelo para los mensajes del chat.
 * Representa la estructura de la tabla 'chat_messages' en la base de datos.
 * Permite almacenar y consultar el historial de mensajes.
 */

import dbConfig from '../../infrastructure/database/dbConfig';

export class ChatMessage {
  id?: number;
  room: string;
  sender: string;  // ID del usuario emisor, en string
  message: string;
  created_at?: Date;

  constructor(room: string, sender: string, message: string) {
    this.room = room;
    this.sender = sender;
    this.message = message;
  }

  /**
   * Crea un mensaje en la base de datos.
   */
  static async create(chatMessage: ChatMessage): Promise<ChatMessage> {
    const pool = dbConfig.getPool();
    const [result] = await pool.query(
      `INSERT INTO chat_messages (room, sender, message, created_at)
       VALUES (?, ?, ?, NOW())`,
      [chatMessage.room, chatMessage.sender, chatMessage.message]
    );
    chatMessage.id = (result as any).insertId;
    return chatMessage;
  }

  /**
   * Retorna todos los mensajes de una sala específica.
   */
  static async findByRoom(room: string): Promise<any[]> {
    const pool = dbConfig.getPool();
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM chat_messages WHERE room = ? ORDER BY created_at ASC',
      [room]
    );
    return rows; // ✅ Garantiza que rows se trate como un arreglo de resultados.
  }

  /**
   * Encuentra las salas (rooms) en las que participa un usuario.
   */
  static async findRoomsByUser(userId: number): Promise<any[]> {
    const pool = dbConfig.getPool();
    const userStr = String(userId);
    const [rows] = await pool.query<any[]>(
      `SELECT DISTINCT room FROM chat_messages WHERE room LIKE ? OR sender = ?`,
      [`%${userStr}%`, userStr]
    );
    return rows; // ✅ Se asegura de que se retorne un arreglo adecuado.
  }
}