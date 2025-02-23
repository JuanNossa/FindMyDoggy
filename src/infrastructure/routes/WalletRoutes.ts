// src/infrastructure/routes/WalletRoutes.ts

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { Wallet } from '../../domain/models/Wallet';
import dbConfig from '../../infrastructure/database/dbConfig';

const router = Router();

/**
 * ✅ GET /api/wallets - Obtiene todas las wallets con información de usuario.
 */
router.get('/', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const pool = dbConfig.getPool();
  const [rows] = await pool.query(`
    SELECT w.id, w.user_id, u.name, u.email, CAST(w.balance AS DECIMAL(10,2)) AS balance
    FROM wallets w
    JOIN users u ON w.user_id = u.id
  `);
  res.json({ wallets: rows });
}));

/**
 * GET /api/wallet/:user_id - Retorna la wallet de un usuario.
 */
router.get('/:user_id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.user_id);

  if (!userId || isNaN(userId)) {
    res.status(400).json({ error: 'El ID de usuario no es válido.' });
    return;
  }

  const wallet = await Wallet.findByUserId(userId);
  res.json({ wallet: wallet ?? { balance: 0 } });
}));

/**
 * POST /api/wallet/buy - Permite a un usuario comprar coins.
 */
router.post('/buy', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.body.user_id);
  const amountCOP = Number(req.body.amountCOP);

  if (!user_id || isNaN(user_id)) {
    res.status(400).json({ error: `El ID de usuario no es válido. Recibido: ${req.body.user_id}` });
    return;
  }

  if (!amountCOP || isNaN(amountCOP) || amountCOP < 20000 || amountCOP > 500000) {
    res.status(400).json({ message: 'El monto debe ser entre $20,000 y $500,000 COP.' });
    return;
  }

  const coins = Math.round((amountCOP / 20000) * 1000);  // ✅ Redondeo aplicado
  let wallet = await Wallet.findByUserId(user_id) ?? await Wallet.create({ user_id });

  const newBalance = Math.round(wallet.balance + coins);  // ✅ Redondeo al calcular
  const success = await Wallet.updateBalance(user_id, newBalance);

  if (!success) {
    res.status(500).json({ message: 'Error al actualizar el saldo.' });
    return;
  }

  res.json({ message: 'Compra exitosa', coinsComprados: coins, nuevoSaldo: newBalance });
}));

/**
 * POST /api/wallet/transfer - Permite transferir coins entre usuarios.
 */
router.post('/transfer', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const from_user_id = Number(req.body.from_user_id);
  const to_user_id = Number(req.body.to_user_id);
  const amount = Number(req.body.amount);

  if ([from_user_id, to_user_id, amount].some(val => !val || isNaN(val))) {
    res.status(400).json({ error: 'Datos inválidos para la transferencia.' });
    return;
  }

  if (amount < 1000) {
    res.status(400).json({ message: 'La transferencia mínima es de 1,000 coins.' });
    return;
  }

  const senderWallet = await Wallet.findByUserId(from_user_id);
  if (!senderWallet) {
    res.status(404).json({ message: 'Wallet del emisor no encontrada.' });
    return;
  }

  // Crear wallet para el receptor si no existe
  let receiverWallet = await Wallet.findByUserId(to_user_id);
  if (!receiverWallet) {
    receiverWallet = await Wallet.create({ user_id: to_user_id, balance: 0 });
  }

  if (senderWallet.balance < amount) {
    res.status(400).json({ message: 'Saldo insuficiente.' });
    return;
  }

  const newSenderBalance = Math.round(senderWallet.balance - amount);     // ✅ Redondeo aplicado
  const newReceiverBalance = Math.round(receiverWallet.balance + amount); // ✅ Redondeo aplicado

  const updatedSender = await Wallet.updateBalance(from_user_id, newSenderBalance);
  const updatedReceiver = await Wallet.updateBalance(to_user_id, newReceiverBalance);

  if (!updatedSender || !updatedReceiver) {
    res.status(500).json({ message: 'Error al realizar la transferencia.' });
    return;
  }

  res.json({
    message: 'Transferencia exitosa',
    saldoEmisor: newSenderBalance,
    saldoReceptor: newReceiverBalance
  });
}));

/**
 * ✅ PUT /api/wallets/:id - Permite al administrador actualizar el saldo de una wallet.
 */
/**
 * ✅ PUT /api/wallets/:user_id - Permite al administrador actualizar el saldo de una wallet.
 */
router.put('/:user_id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user_id = Number(req.params.user_id);
  const { balance } = req.body;

  if (!user_id || isNaN(user_id)) {
    res.status(400).json({ message: 'ID de usuario inválido.' });
    return;
  }

  if (balance === undefined || isNaN(Number(balance)) || Number(balance) < 0) {
    res.status(400).json({ message: 'Saldo inválido. Debe ser un número positivo.' });
    return;
  }

  const wallet = await Wallet.findByUserId(user_id);
  if (!wallet) {
    res.status(404).json({ message: 'Wallet no encontrada.' });
    return;
  }

  const updated = await Wallet.updateBalance(user_id, Number(balance));
  if (!updated) {
    res.status(500).json({ message: 'Error al actualizar el saldo.' });
    return;
  }

  res.status(200).json({ message: 'Saldo actualizado correctamente.', nuevoSaldo: balance });
}));

export default router;