// src/domain/models/Publication.ts

import DBConfig from '../../infrastructure/database/dbConfig';

/**
 * Modelo para las Publicaciones.
 * Representa la estructura de la tabla 'publications' en la base de datos,
 * incluyendo información de imagen y ubicación (latitude, longitude).
 */
export class Publication {
  id?: number;
  title: string;
  description: string;
  reward: number;
  user_id: number;
  location_id?: number;
  image_path?: string;
  latitude?: number;
  longitude?: number;
  created_at?: Date;

  /**
   * Constructor para crear una instancia de Publication.
   * @param title Título de la publicación.
   * @param description Descripción de la publicación.
   * @param reward Recompensa en COP.
   * @param user_id ID del usuario que crea la publicación.
   * @param location_id (Opcional) ID de la ubicación.
   * @param image_path (Opcional) Nombre del archivo de la imagen.
   * @param latitude (Opcional) Latitud de la ubicación.
   * @param longitude (Opcional) Longitud de la ubicación.
   */
  constructor(
    title: string,
    description: string,
    reward: number,
    user_id: number,
    location_id?: number,
    image_path?: string,
    latitude?: number,
    longitude?: number
  ) {
    this.title = title;
    this.description = description;
    this.reward = reward;
    this.user_id = user_id;
    this.location_id = location_id;
    this.image_path = image_path;
    this.latitude = latitude;
    this.longitude = longitude;
    this.created_at = new Date();
  }

  /**
   * Inserta una nueva publicación en la base de datos.
   * @param publication Instancia de Publication a crear.
   * @returns La publicación creada con su ID asignado.
   */
  static async create(publication: Publication): Promise<Publication> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      `INSERT INTO publications 
      (title, description, reward, user_id, location_id, image_path, latitude, longitude, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        publication.title,
        publication.description,
        publication.reward,
        publication.user_id,
        publication.location_id,
        publication.image_path,
        publication.latitude,
        publication.longitude
      ]
    );
    publication.id = (result as any).insertId;
    return publication;
  }

  /**
   * Retorna todas las publicaciones.
   */
  static async findAll(): Promise<Publication[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM publications');
    return rows as Publication[];
  }

  /**
   * Busca una publicación por su ID.
   * @param id ID de la publicación.
   */
  static async findById(id: number): Promise<Publication | null> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM publications WHERE id = ?', [id]);
    const results = rows as any[];
    if (results.length > 0) {
      const row = results[0];
      const publication = new Publication(
        row.title,
        row.description,
        row.reward,
        row.user_id,
        row.location_id,
        row.image_path,
        row.latitude,
        row.longitude
      );
      publication.id = row.id;
      publication.created_at = row.created_at;
      return publication;
    }
    return null;
  }

  /**
   * Actualiza una publicación.
   * @param id ID de la publicación a actualizar.
   * @param data Objeto parcial con los campos a actualizar.
   */
  static async update(id: number, data: Partial<Publication>): Promise<Publication | null> {
    const pool = DBConfig.getPool();
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
      // En lugar de null, devolvemos undefined para cumplir con el tipo
      values.push(data.location_id !== null ? data.location_id : undefined);
    }
    if (typeof data.image_path !== 'undefined') {
      fields.push('image_path = ?');
      values.push(data.image_path);
    }
    if (typeof data.latitude !== 'undefined') {
      fields.push('latitude = ?');
      values.push(data.latitude !== null ? data.latitude : undefined);
    }
    if (typeof data.longitude !== 'undefined') {
      fields.push('longitude = ?');
      values.push(data.longitude !== null ? data.longitude : undefined);
    }

    if (fields.length === 0) {
      return Publication.findById(id);
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    await pool.query(query, values);
    return Publication.findById(id);
  }

  /**
   * Elimina una publicación.
   * @param id ID de la publicación a eliminar.
   */
  static async delete(id: number): Promise<boolean> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query('DELETE FROM publications WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}