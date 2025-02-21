// src/infrastructure/routes/WalletRoutes.ts

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { Wallet } from '../../domain/models/Wallet';

const router = Router();

/**
 * GET /api/wallets
 * Lista todas las wallets (usado por el administrador).
 */
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const wallets = await Wallet.findAll();
  res.json({ wallets });
}));

/**
 * GET /api/wallet/:user_id
 * Retorna la wallet de un usuario específico.
 */
router.get('/:user_id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.user_id);
  const wallet = await Wallet.findByUserId(userId);
  res.json({ wallet });
}));

/**
 * POST /api/wallet/buy
 * Permite a un usuario comprar coins.
 * Se espera en el body: { user_id, amountCOP }
 */
router.post('/buy', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user_id, amountCOP } = req.body;
  // Ejemplo de conversión: $20.000 COP = 1.000 coins
  const coins = Math.floor((Number(amountCOP) / 20000) * 1000);

  let wallet = await Wallet.findByUserId(Number(user_id));
  if (!wallet) {
    wallet = await Wallet.create({ user_id: Number(user_id), balance: 0 });
  }
  const newBalance = wallet.balance + coins;
  const success = await Wallet.updateBalance(Number(user_id), newBalance);
  if (!success) {
    res.status(500).json({ message: 'No se pudo actualizar el saldo de la wallet' });
    return;
  }
  res.json({ message: 'Compra de coins exitosa', coinsComprados: coins, nuevoSaldo: newBalance });
}));

/**
 * POST /api/wallet/transfer
 * Permite transferir coins de un usuario a otro.
 * Se espera en el body: { from_user_id, to_user_id, amount }
 */
router.post('/transfer', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { from_user_id, to_user_id, amount } = req.body;
  // Aquí implementar la lógica de transferencia:
  // - Validar que el monto sea >= 1000 coins.
  // - Restar del emisor y sumar al receptor.
  // Para este ejemplo, devolvemos una respuesta simulada.
  res.json({ message: 'Transferencia realizada (ejemplo)' });
}));

export default router;