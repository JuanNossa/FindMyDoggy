// src/application/controllers/WalletController.ts

/**
 * Controlador para el módulo de Wallet/Coins.
 * Permite consultar el saldo de la wallet, comprar coins (simulación) y transferir coins a otros usuarios.
 */

import { Request, Response } from 'express';
import { Wallet } from '../../domain/models/Wallet';
import { Transaction } from '../../domain/models/Transaction';
import DBConfig from '../../infrastructure/database/dbConfig';

export class WalletController {
  /**
   * Consulta la wallet del usuario.
   * Se espera que el ID del usuario se pase como parámetro en la URL.
   */
  static async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const wallet = await Wallet.findByUserId(Number(user_id));
      if (!wallet) {
        res.status(404).json({ message: 'Wallet no encontrada para el usuario' });
        return;
      }
      res.json({ wallet });
      return;
    } catch (error: any) {
      console.error('Error en WalletController.getWallet:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

/**
 * Simula la compra de coins.
 * Se espera en el body: user_id y amountCOP en COP.
 * La conversión es: $20.000 COP = 1.000 coins.
 * Se limita la compra máxima a $500.000 COP por transacción.
 */static async buyCoins(req: Request, res: Response): Promise<void> {
  try {
    const { user_id, amountCOP } = req.body;
    if (!user_id || !amountCOP) {
      res.status(400).json({ message: 'Se requieren user_id y amountCOP' });
      return;
    }

    // Validar que el monto no supere $500.000 COP
    if (Number(amountCOP) > 500000) {
      res.status(400).json({ message: 'El monto máximo de compra es $500.000 COP' });
      return;
    }

    // Calcular los coins basados en la conversión:
    // $20.000 COP = 1.000 coins, es decir, coins = (amountCOP / 20000) * 1000
    const coins = Math.floor((Number(amountCOP) / 20000) * 1000);

    // Buscar o crear la wallet del usuario
    let wallet = await Wallet.findByUserId(Number(user_id));
    if (!wallet) {
      // Si no existe, crearla
      wallet = await Wallet.create(new Wallet(Number(user_id), 0));
    }

    // Aseguramos que el balance se maneje como número
    const currentBalance = parseFloat(wallet.balance.toString());
    const newBalance = currentBalance + coins;
    const success = await Wallet.updateBalance(Number(user_id), newBalance);
    if (!success) {
      res.status(500).json({ message: 'No se pudo actualizar el saldo de la wallet' });
      return;
    }

    // Registrar la transacción de crédito
    await Transaction.create(new Transaction(wallet.id!, 'credit', coins, 'Compra de coins'));

    res.json({ message: 'Compra de coins exitosa', coinsComprados: coins, nuevoSaldo: newBalance });
    return;
  } catch (error: any) {
    console.error('Error en WalletController.buyCoins:', error);
    res.status(500).json({ error: error.message });
    return;
  }
}
/**
 * Transfiere coins de un usuario a otro.
 * Se espera en el body: from_user_id, to_user_id y amount (coins).
 * Se valida que el monto sea al menos 1,000 coins.
 */
static async transferCoins(req: Request, res: Response): Promise<void> {
    try {
      const { from_user_id, to_user_id, amount } = req.body;
      if (!from_user_id || !to_user_id || !amount) {
        res.status(400).json({ message: 'Se requieren from_user_id, to_user_id y amount' });
        return;
      }
      if (Number(amount) < 1000) {
        res.status(400).json({ message: 'La transferencia mínima es de 1000 coins' });
        return;
      }
  
      // Obtener wallets de ambos usuarios
      const fromWallet = await Wallet.findByUserId(Number(from_user_id));
      const toWallet = await Wallet.findByUserId(Number(to_user_id));
  
      if (!fromWallet) {
        res.status(404).json({ message: 'Wallet del usuario emisor no encontrada' });
        return;
      }
      if (!toWallet) {
        res.status(404).json({ message: 'Wallet del usuario receptor no encontrada' });
        return;
      }
  
      // Convertir saldos y monto a números
      const fromBalance = parseFloat(fromWallet.balance.toString());
      const toBalance = parseFloat(toWallet.balance.toString());
      const transferAmount = Number(amount);
  
      // Verificar saldo suficiente
      if (fromBalance < transferAmount) {
        res.status(400).json({ message: 'Saldo insuficiente para la transferencia' });
        return;
      }
  
      // Calcular nuevos saldos
      const newFromBalance = fromBalance - transferAmount;
      const newToBalance = toBalance + transferAmount;
  
      const pool = DBConfig.getPool();
      // Usar transacción para asegurar integridad
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
  
        await connection.query('UPDATE wallets SET balance = ?, updated_at = NOW() WHERE user_id = ?', [
          newFromBalance,
          from_user_id,
        ]);
  
        await connection.query('UPDATE wallets SET balance = ?, updated_at = NOW() WHERE user_id = ?', [
          newToBalance,
          to_user_id,
        ]);
  
        // Registrar la transacción para el emisor
        await connection.query(
          'INSERT INTO transactions (wallet_id, type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())',
          [fromWallet.id, 'debit', transferAmount, `Transferencia a usuario ${to_user_id}`]
        );
        // Registrar la transacción para el receptor
        await connection.query(
          'INSERT INTO transactions (wallet_id, type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())',
          [toWallet.id, 'credit', transferAmount, `Transferencia desde usuario ${from_user_id}`]
        );
  
        await connection.commit();
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
  
      res.json({
        message: 'Transferencia exitosa',
        saldoEmisor: newFromBalance,
        saldoReceptor: newToBalance,
      });
      return;
    } catch (error: any) {
      console.error('Error en WalletController.transferCoins:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }
}