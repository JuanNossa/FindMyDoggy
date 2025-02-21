// src/infrastructure/routes/WalletRoutes.ts

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { Wallet } from '../../domain/models/Wallet';

const router = Router();

// Endpoint para que admin obtenga todas las wallets
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const wallets = await Wallet.findAll();
  res.json({ wallets });
}));

// Endpoint para que un usuario obtenga su wallet
router.get('/:user_id', asyncHandler(async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  const wallet = await Wallet.findByUserId(user_id);
  res.json({ wallet });
}));

// Endpoint para actualizar (solo admin) el saldo de una wallet
router.put('/:walletId', asyncHandler(async (req: Request, res: Response) => {
  const walletId = Number(req.params.walletId);
  // Para actualizar por user_id, podrías buscar la wallet primero y luego actualizar
  const { balance } = req.body;
  // Asumimos que se pasa user_id en body para identificar la wallet
  const user_id = Number(req.body.user_id);
  const success = await Wallet.updateBalance(user_id, balance);
  res.json({ message: success ? 'Wallet actualizada' : 'Error al actualizar wallet' });
}));

export default router;