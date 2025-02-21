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

  static async create(wallet: Wallet): Promise<Wallet> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO wallets (user_id, balance, updated_at) VALUES (?, ?, NOW())',
      [wallet.user_id, wallet.balance]
    );
    wallet.id = (result as any).insertId;
    return wallet;
  }

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

  static async findAll(): Promise<Wallet[]> {
    const pool = DBConfig.getPool();
    const [rows] = await pool.query('SELECT * FROM wallets');
    return rows as Wallet[];
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