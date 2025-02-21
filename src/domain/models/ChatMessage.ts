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
  sender: string;  // ID del usuario emisor, en string
  message: string;
  created_at?: Date;

  constructor(room: string, sender: string, message: string) {
    this.room = room;
    this.sender = sender;
    this.message = message;
  }

  // Crea un mensaje en la DB
  static async create(chatMessage: ChatMessage): Promise<ChatMessage> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      `INSERT INTO chat_messages (room, sender, message, created_at)
       VALUES (?, ?, ?, NOW())`,
      [chatMessage.room, chatMessage.sender, chatMessage.message]
    );
    chatMessage.id = (result as any).insertId;
    return chatMessage;
  }

  // Retorna todos los mensajes de una sala
  static async findByRoom(room: string): Promise<ChatMessage[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query(
      `SELECT * FROM chat_messages WHERE room = ? ORDER BY created_at ASC`,
      [room]
    );
    return rows as ChatMessage[];
  }

  // Encuentra las rooms en las que participa un userId
  static async findRoomsByUser(userId: number): Promise<{ room: string }[]> {
    const pool = DBConfig.getPool();
    // Aquí asumimos que "sender" es un string con el userId
    const [rows] = await pool.query(
      `SELECT DISTINCT room
       FROM chat_messages
       WHERE sender = ?`,
      [String(userId)]
    );
    return rows as { room: string }[];
  }
}