"use strict";
// src/infrastructure/routes/WalletRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const Wallet_1 = require("../../domain/models/Wallet");
const router = (0, express_1.Router)();
/**
 * GET /api/wallets
 * Lista todas las wallets (usado por el administrador).
 */
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const wallets = await Wallet_1.Wallet.findAll();
    res.json({ wallets });
}));
/**
 * GET /api/wallet/:user_id
 * Retorna la wallet de un usuario específico.
 */
router.get('/:user_id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.user_id);
    const wallet = await Wallet_1.Wallet.findByUserId(userId);
    res.json({ wallet });
}));
/**
 * POST /api/wallet/buy
 * Permite a un usuario comprar coins.
 * Se espera en el body: { user_id, amountCOP }
 */
router.post('/buy', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_id, amountCOP } = req.body;
    // Ejemplo de conversión: $20.000 COP = 1.000 coins
    const coins = Math.floor((Number(amountCOP) / 20000) * 1000);
    let wallet = await Wallet_1.Wallet.findByUserId(Number(user_id));
    if (!wallet) {
        wallet = await Wallet_1.Wallet.create({ user_id: Number(user_id), balance: 0 });
    }
    const newBalance = wallet.balance + coins;
    const success = await Wallet_1.Wallet.updateBalance(Number(user_id), newBalance);
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
router.post('/transfer', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { from_user_id, to_user_id, amount } = req.body;
    // Aquí implementar la lógica de transferencia:
    // - Validar que el monto sea >= 1000 coins.
    // - Restar del emisor y sumar al receptor.
    // Para este ejemplo, devolvemos una respuesta simulada.
    res.json({ message: 'Transferencia realizada (ejemplo)' });
}));
exports.default = router;
