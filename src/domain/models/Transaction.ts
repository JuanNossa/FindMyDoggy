// src/domain/models/Transaction.ts

/**
 * Modelo para las transacciones de la wallet.
 * Registra cada movimiento (crédito o débito) que afecta el saldo de la billetera.
 */

import DBConfig from '../../infrastructure/database/dbConfig';

export class Transaction {
  id?: number;
  wallet_id: number;
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
  created_at?: Date;

  constructor(wallet_id: number, type: 'credit' | 'debit', amount: number, description?: string) {
    this.wallet_id = wallet_id;
    this.type = type;
    this.amount = amount;
    this.description = description;
  }

  /**
   * Inserta una nueva transacción en la base de datos.
   * @param transaction Instancia de Transaction a registrar.
   * @returns La transacción creada con su ID asignado.
   */
  static async create(transaction: Transaction): Promise<Transaction> {
    const pool = DBConfig.getPool();
    const [result] = await pool.query(
      'INSERT INTO transactions (wallet_id, type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())',
      [transaction.wallet_id, transaction.type, transaction.amount, transaction.description]
    );
    transaction.id = (result as any).insertId;
    return transaction;
  }
}