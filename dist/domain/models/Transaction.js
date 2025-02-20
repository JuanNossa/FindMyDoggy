"use strict";
// src/domain/models/Transaction.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
/**
 * Modelo para las transacciones de la wallet.
 * Registra cada movimiento (crédito o débito) que afecta el saldo de la billetera.
 */
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
class Transaction {
    constructor(wallet_id, type, amount, description) {
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
    static async create(transaction) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('INSERT INTO transactions (wallet_id, type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())', [transaction.wallet_id, transaction.type, transaction.amount, transaction.description]);
        transaction.id = result.insertId;
        return transaction;
    }
}
exports.Transaction = Transaction;
