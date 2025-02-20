// src/domain/models/User.ts

/**
 * Modelo para el usuario.
 * Representa la estructura de la tabla 'users' en la base de datos.
 * Incluye métodos estáticos para crear y buscar usuarios usando mysql2.
 */

import DBConfig from '../../infrastructure/database/dbConfig';

export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;

  constructor(name: string, email: string, password: string, role: string = 'user') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  /**
   * Inserta un nuevo usuario en la base de datos.
   * @param user Instancia de User a crear.
   * @returns La instancia del usuario con su ID asignado.
   */
  static async create(user: User): Promise<User> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.password, user.role]
    );
    user.id = (result as any).insertId;
    return user;
  }

  /**
   * Busca un usuario por email.
   * @param email Email del usuario a buscar.
   * @returns Una instancia de User si se encuentra, o null en caso contrario.
   */
  static async findByEmail(email: string): Promise<User | null> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const results = rows as any[];
    if (results.length > 0) {
      const row = results[0];
      const user = new User(row.name, row.email, row.password, row.role);
      user.id = row.id;
      return user;
    }
    return null;
  }

  /**
   * Busca un usuario por su ID.
   * @param id ID del usuario a buscar.
   * @returns Una instancia de User si se encuentra, o null en caso contrario.
   */
  static async findById(id: number): Promise<User | null> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const results = rows as any[];
    if (results.length > 0) {
      const row = results[0];
      const user = new User(row.name, row.email, row.password, row.role);
      user.id = row.id;
      return user;
    }
    return null;
  }
}
