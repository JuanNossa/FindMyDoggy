// src/domain/models/Wallet.ts

import DBConfig from '../../infrastructure/database/dbConfig';

/**
 * Modelo para la wallet del usuario.
 */
export class Wallet {
  id?: number;
  user_id: number;
  balance: number;
  updated_at?: Date;

  /**
   * Crea una instancia de Wallet.
   * @param user_id ID del usuario propietario de la wallet.
   * @param balance Saldo inicial (por defecto 0).
   */
  constructor(user_id: number, balance: number = 0) {
    this.user_id = user_id;
    this.balance = balance;
  }

  /**
   * Crea una wallet en la base de datos.
   * @param walletData Objeto con los datos de la wallet.
   * @returns La wallet creada.
   */
  static async create(walletData: { user_id: number; balance?: number }): Promise<Wallet> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO wallets (user_id, balance, updated_at) VALUES (?, ?, NOW())',
      [walletData.user_id, walletData.balance || 0]
    );
    const wallet = new Wallet(walletData.user_id, walletData.balance || 0);
    wallet.id = (result as any).insertId;
    return wallet;
  }

  /**
   * Busca la wallet de un usuario por su ID.
   * @param user_id ID del usuario.
   * @returns La wallet si existe o null.
   */
  static async findByUserId(user_id: number): Promise<Wallet | null> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM wallets WHERE user_id = ?', [user_id]);
    const results = rows as any[];
    if (results.length > 0) {
      const row = results[0];
      const wallet = new Wallet(row.user_id, row.balance);
      wallet.id = row.id;
      wallet.updated_at = row.updated_at;
      return wallet;
    }
    return null;
  }

  /**
   * Retorna todas las wallets registradas.
   * @returns Un arreglo de wallets.
   */
  static async findAll(): Promise<Wallet[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM wallets');
    return rows as Wallet[];
  }

  /**
   * Actualiza el saldo de la wallet de un usuario.
   * @param user_id ID del usuario.
   * @param newBalance Nuevo saldo.
   * @returns True si se actualizó, false en caso contrario.
   */
  static async updateBalance(user_id: number, newBalance: number): Promise<boolean> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'UPDATE wallets SET balance = ?, updated_at = NOW() WHERE user_id = ?',
      [newBalance, user_id]
    );
    return (result as any).affectedRows > 0;
  }
}