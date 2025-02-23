// src/domain/models/Wallet.ts

import DBConfig from '../../infrastructure/database/dbConfig';

export class Wallet {
  id?: number;
  user_id: number;
  balance: number;

  constructor(user_id: number, balance: number = 0) {
    this.user_id = user_id;
    this.balance = balance;
  }

  /**
   * Crea una wallet para un usuario.
   */
  static async create(walletData: { user_id: number; balance?: number }): Promise<Wallet> {
    if (!walletData.user_id || isNaN(walletData.user_id)) {
      throw new Error(`ID de usuario inválido en Wallet.create. Recibido: ${walletData.user_id}`);
    }

    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO wallets (user_id, balance, updated_at) VALUES (?, ?, NOW())',
      [walletData.user_id, Math.round(walletData.balance ?? 0)]  // ✅ Redondeo aplicado
    );

    return new Wallet(walletData.user_id, Math.round(walletData.balance ?? 0));
  }

  /**
   * Busca la wallet de un usuario por su ID.
   */
  static async findByUserId(user_id: number): Promise<Wallet | null> {
    if (!user_id || isNaN(user_id)) {
      console.error(`ID de usuario inválido en Wallet.findByUserId: ${user_id}`);
      return null;
    }

    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM wallets WHERE user_id = ?', [user_id]);
    const result = (rows as any[])[0];

    if (!result) {
      console.warn(`No se encontró wallet para user_id: ${user_id}`);
      return null;
    }

    return new Wallet(result.user_id, Math.round(result.balance));  // ✅ Redondeo al obtener
  }

  /**
   * Actualiza el saldo de una wallet.
   */
  static async updateBalance(user_id: number, newBalance: number): Promise<boolean> {
    if (!user_id || isNaN(user_id)) {
      console.error(`ID de usuario inválido en Wallet.updateBalance: ${user_id}`);
      return false;
    }

    const roundedBalance = Math.round(newBalance);  // ✅ Redondear antes de actualizar
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'UPDATE wallets SET balance = ?, updated_at = NOW() WHERE user_id = ?',
      [roundedBalance, user_id]
    );

    const success = (result as any).affectedRows > 0;
    if (!success) {
      console.error(`Fallo al actualizar el balance para user_id: ${user_id}`);
    }

    return success;
  }
}