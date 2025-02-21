import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { Wallet } from '../../domain/models/Wallet';

const router = Router();

/**
 * GET /api/wallet/:user_id
 * Retorna la wallet de un usuario específico.
 */
router.get('/:user_id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.user_id);
  if (isNaN(userId)) {
    res.status(400).json({ message: "ID de usuario no válido" });
    return;
  }
  const wallet = await Wallet.findByUserId(userId);
  res.json({ wallet });
}));

/**
 * POST /api/wallet/buy
 * Permite a un usuario comprar coins.
 * Se espera en el body: { user_id, amountCOP }
 */
router.post('/buy', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  console.log("POST /buy body =>", req.body);

  const { user_id, amountCOP } = req.body;
  const userIdNum = Number(user_id);
  const amountCOPNum = Number(amountCOP);

  if (isNaN(userIdNum)) {
    res.status(400).json({ message: "ID de usuario no válido" });
    return;
  }
  if (isNaN(amountCOPNum)) {
    res.status(400).json({ message: "Monto en COP no válido" });
    return;
  }

  // Conversión: $20.000 COP = 1.000 coins
  const coins = Math.floor((amountCOPNum / 20000) * 1000);

  let wallet = await Wallet.findByUserId(userIdNum);
  if (!wallet) {
    wallet = await Wallet.create({ user_id: userIdNum, balance: 0 });
  }
  const newBalance = wallet.balance + coins;
  const success = await Wallet.updateBalance(userIdNum, newBalance);
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
  console.log("POST /transfer body =>", req.body);

  const { from_user_id, to_user_id, amount } = req.body;
  const fromUserIdNum = Number(from_user_id);
  const toUserIdNum = Number(to_user_id);
  const amountNum = Number(amount);

  if (isNaN(fromUserIdNum) || isNaN(toUserIdNum) || isNaN(amountNum)) {
    res.status(400).json({ message: "Datos de transferencia no válidos" });
    return;
  }
  if (amountNum < 1000) {
    res.status(400).json({ message: "El monto a transferir debe ser al menos 1000 coins." });
    return;
  }

  const fromWallet = await Wallet.findByUserId(fromUserIdNum);
  if (!fromWallet) {
    res.status(404).json({ message: "El usuario emisor no tiene wallet creada." });
    return;
  }
  const toWallet = await Wallet.findByUserId(toUserIdNum);
  if (!toWallet) {
    res.status(404).json({ message: "El usuario receptor no tiene wallet creada." });
    return;
  }
  if (fromWallet.balance < amountNum) {
    res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia." });
    return;
  }

  const newFromBalance = fromWallet.balance - amountNum;
  const newToBalance = toWallet.balance + amountNum;

  const successFrom = await Wallet.updateBalance(fromUserIdNum, newFromBalance);
  if (!successFrom) {
    res.status(500).json({ message: "No se pudo actualizar el saldo del emisor." });
    return;
  }

  const successTo = await Wallet.updateBalance(toUserIdNum, newToBalance);
  if (!successTo) {
    await Wallet.updateBalance(fromUserIdNum, fromWallet.balance);
    res.status(500).json({ message: "No se pudo actualizar el saldo del receptor." });
    return;
  }

  res.json({
    message: "Transferencia realizada con éxito.",
    emisorSaldo: newFromBalance,
    receptorSaldo: newToBalance
  });
}));

export default router;