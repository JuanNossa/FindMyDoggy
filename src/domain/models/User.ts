// src/domain/models/User.ts

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

  static async create(user: User): Promise<User> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.password, user.role]
    );
    user.id = (result as any).insertId;
    return user;
  }

  static async findAll(): Promise<User[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM users');
    return rows as User[];
  }

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

  static async update(id: number, data: Partial<User>): Promise<User | null> {
    const pool = DBConfig.getPool();
    let query = 'UPDATE users SET ';
    const fields: string[] = [];
    const values: any[] = [];
    if (data.name) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.password) {
      fields.push('password = ?');
      values.push(data.password);
    }
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }
    if (fields.length === 0) {
      return User.findById(id);
    }
    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);
    await pool.query(query, values);
    return User.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }

    /**
   * Busca un usuario por su correo electrónico.
   * @param email Correo del usuario a buscar.
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
}