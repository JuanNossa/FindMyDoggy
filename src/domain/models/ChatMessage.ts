// src/domain/models/ChatMessage.ts

/**
 * Modelo para los mensajes del chat.
 * Representa la estructura de la tabla 'chat_messages' en la base de datos.
 * Permite almacenar y consultar el historial de mensajes.
 */

import DBConfig from '../../infrastructure/database/dbConfig';

export class ChatMessage {
  id?: number;
  room: string;
  sender: string;
  message: string;
  created_at?: Date;

  constructor(room: string, sender: string, message: string) {
    this.room = room;
    this.sender = sender;
    this.message = message;
  }

  /**
   * Inserta un mensaje de chat en la base de datos.
   * @param chatMessage Instancia de ChatMessage a guardar.
   * @returns La instancia con el ID asignado.
   */
  static async create(chatMessage: ChatMessage): Promise<ChatMessage> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO chat_messages (room, sender, message, created_at) VALUES (?, ?, ?, NOW())',
      [chatMessage.room, chatMessage.sender, chatMessage.message]
    );
    chatMessage.id = (result as any).insertId;
    return chatMessage;
  }

  /**
   * Retorna todos los mensajes de un chat (sala) específico.
   * @param room Nombre de la sala.
   * @returns Un array de ChatMessage.
   */
  static async findByRoom(room: string): Promise<ChatMessage[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM chat_messages WHERE room = ? ORDER BY created_at ASC', [room]);
    return rows as ChatMessage[];
  }
}