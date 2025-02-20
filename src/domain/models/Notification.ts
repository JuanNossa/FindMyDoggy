// src/domain/models/Notification.ts

/**
 * Modelo para las notificaciones.
 * Representa la estructura de la tabla 'notifications' en la base de datos.
 * Provee métodos para crear una notificación y buscar notificaciones por usuario.
 */

import DBConfig from '../../infrastructure/database/dbConfig';

export class Notification {
  id?: number;
  user_id: number;
  message: string;
  created_at?: Date;

  /**
   * Constructor para crear una instancia de Notification.
   * @param user_id ID del usuario que recibirá la notificación.
   * @param message Contenido del mensaje de la notificación.
   */
  constructor(user_id: number, message: string) {
    this.user_id = user_id;
    this.message = message;
  }

  /**
   * Inserta una nueva notificación en la base de datos.
   * @param notification Instancia de Notification a insertar.
   * @returns La notificación creada con su ID asignado.
   */
  static async create(notification: Notification): Promise<Notification> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())',
      [notification.user_id, notification.message]
    );
    notification.id = (result as any).insertId;
    return notification;
  }

  /**
   * Busca todas las notificaciones de un usuario.
   * @param user_id ID del usuario.
   * @returns Un array de notificaciones asociadas al usuario.
   */
  static async findByUserId(user_id: number): Promise<Notification[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ?', [user_id]);
    return rows as Notification[];
  }
}