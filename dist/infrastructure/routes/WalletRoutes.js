"use strict";
// src/infrastructure/routes/WalletRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const Wallet_1 = require("../../domain/models/Wallet");
const router = (0, express_1.Router)();
/**
 * GET /api/wallet/:user_id
 * Retorna la wallet de un usuario específico.
 */
router.get('/:user_id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.user_id);
    if (!userId || isNaN(userId)) {
        res.status(400).json({ error: 'El ID de usuario no es válido.' });
        return;
    }
    const wallet = await Wallet_1.Wallet.findByUserId(userId);
    if (!wallet) {
        res.status(404).json({ message: 'Wallet no encontrada para el usuario.' });
        return;
    }
    res.json({ wallet });
}));
/**
 * POST /api/wallet/buy
 * Permite a un usuario comprar coins.
 */
router.post('/buy', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log('REQUEST BODY en /buy:', req.body); // Verifica que se reciba correctamente
    const { user_id, amountCOP } = req.body;
    if (!user_id || isNaN(Number(user_id))) {
        res.status(400).json({ error: `El ID de usuario no es válido. Recibido: ${user_id}` });
        return;
    }
    if (!amountCOP || isNaN(Number(amountCOP))) {
        res.status(400).json({ error: `El monto ingresado es inválido. Recibido: ${amountCOP}` });
        return;
    }
    const coins = Math.floor(Number(amountCOP) / 20000 * 1000);
    let wallet = await Wallet_1.Wallet.findByUserId(Number(user_id));
    if (!wallet) {
        wallet = await Wallet_1.Wallet.create({ user_id: Number(user_id) });
    }
    const newBalance = wallet.balance + coins;
    const success = await Wallet_1.Wallet.updateBalance(Number(user_id), newBalance);
    if (!success) {
        res.status(500).json({ message: 'No se pudo actualizar el saldo de la wallet' });
        return;
    }
    res.json({ message: 'Compra exitosa', coinsComprados: coins, nuevoSaldo: newBalance });
}));
/**
 * POST /api/wallet/transfer
 * Permite transferir coins entre usuarios.
 */
router.post('/transfer', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const from_user_id = Number(req.body.from_user_id);
    const to_user_id = Number(req.body.to_user_id);
    const amount = Number(req.body.amount);
    if ([from_user_id, to_user_id, amount].some(val => !val || isNaN(val))) {
        res.status(400).json({ error: 'Datos inválidos para la transferencia.' });
        return;
    }
    const senderWallet = await Wallet_1.Wallet.findByUserId(from_user_id);
    const receiverWallet = await Wallet_1.Wallet.findByUserId(to_user_id);
    if (!senderWallet || !receiverWallet) {
        res.status(404).json({ message: 'Wallet del emisor o receptor no encontrada.' });
        return;
    }
    if (senderWallet.balance < amount) {
        res.status(400).json({ message: 'Saldo insuficiente para la transferencia.' });
        return;
    }
    const newSenderBalance = senderWallet.balance - amount;
    const newReceiverBalance = receiverWallet.balance + amount;
    await Wallet_1.Wallet.updateBalance(from_user_id, newSenderBalance);
    await Wallet_1.Wallet.updateBalance(to_user_id, newReceiverBalance);
    res.json({
        message: 'Transferencia exitosa',
        saldoEmisor: newSenderBalance,
        saldoReceptor: newReceiverBalance
    });
}));
exports.default = router;
