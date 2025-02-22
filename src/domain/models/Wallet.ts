// src/domain/models/Wallet.ts

import DBConfig from '../../infrastructure/database/dbConfig';

export class Wallet {
  id?: number;
  user_id: number;
  balance: number;
  updated_at?: Date;

  constructor(user_id: number, balance: number = 0) {
    this.user_id = user_id;
    this.balance = balance;
  }

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

  static async findByUserId(user_id: number): Promise<Wallet | null> {
    if (!user_id || isNaN(user_id)) return null;

    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM wallets WHERE user_id = ?', [user_id]);
    const results = rows as any[];

    if (results.length > 0) {
      const row = results[0];
      return new Wallet(row.user_id, row.balance);
    }

    return null;
  }

  static async updateBalance(user_id: number, newBalance: number): Promise<boolean> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'UPDATE wallets SET balance = ?, updated_at = NOW() WHERE user_id = ?',
      [newBalance, user_id]
    );
    return (result as any).affectedRows > 0;
  }
}