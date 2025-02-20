// src/domain/models/Publication.ts

/**
 * Modelo para las publicaciones.
 * Representa la estructura de la tabla 'publications' en la base de datos.
 * Se realizan operaciones CRUD mediante consultas directas usando mysql2.
 */

import DBConfig from '../../infrastructure/database/dbConfig';

export class Publication {
  id?: number;
  title: string;
  description: string;
  reward: number;
  user_id: number;
  location_id?: number;
  created_at?: Date;

  /**
   * Constructor para crear una instancia de Publication.
   * @param title Título de la publicación.
   * @param description Descripción detallada de la publicación.
   * @param reward Recompensa asociada a la publicación.
   * @param user_id ID del usuario que crea la publicación.
   * @param location_id (Opcional) ID de la ubicación asociada.
   */
  constructor(title: string, description: string, reward: number, user_id: number, location_id?: number) {
    this.title = title;
    this.description = description;
    this.reward = reward;
    this.user_id = user_id;
    this.location_id = location_id;
  }

  /**
   * Inserta una nueva publicación en la base de datos.
   * @param publication Instancia de Publication a insertar.
   * @returns La publicación insertada con su ID asignado.
   */
  static async create(publication: Publication): Promise<Publication> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO publications (title, description, reward, user_id, location_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [publication.title, publication.description, publication.reward, publication.user_id, publication.location_id]
    );
    publication.id = (result as any).insertId;
    return publication;
  }

  /**
   * Retorna todas las publicaciones.
   * @returns Un array con todas las publicaciones.
   */
  static async findAll(): Promise<Publication[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM publications');
    return rows as Publication[];
  }

  /**
   * Busca una publicación por su ID.
   * @param id ID de la publicación a buscar.
   * @returns La publicación si se encuentra, o null en caso contrario.
   */
  static async findById(id: number): Promise<Publication | null> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM publications WHERE id = ?', [id]);
    const results = rows as any[];
    if (results.length > 0) {
      const row = results[0];
      const publication = new Publication(row.title, row.description, row.reward, row.user_id, row.location_id);
      publication.id = row.id;
      publication.created_at = row.created_at;
      return publication;
    }
    return null;
  }

  /**
   * Actualiza una publicación por su ID.
   * @param id ID de la publicación a actualizar.
   * @param data Objeto con los campos a actualizar.
   * @returns La publicación actualizada o null si no se encontró.
   */
  static async update(id: number, data: Partial<Publication>): Promise<Publication | null> {
    const pool = DBConfig.getPool();
    // Construir dinámicamente la sentencia SQL para actualizar según los campos presentes
    let query = 'UPDATE publications SET ';
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (typeof data.reward !== 'undefined') {
      fields.push('reward = ?');
      values.push(data.reward);
    }
    if (typeof data.location_id !== 'undefined') {
      fields.push('location_id = ?');
      values.push(data.location_id);
    }

    if (fields.length === 0) {
      // Si no hay campos a actualizar, se retorna la publicación actual
      return Publication.findById(id);
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    await pool.query(query, values);
    return Publication.findById(id);
  }

  /**
   * Elimina una publicación por su ID.
   * @param id ID de la publicación a eliminar.
   * @returns True si se eliminó, false de lo contrario.
   */
  static async delete(id: number): Promise<boolean> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query('DELETE FROM publications WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}