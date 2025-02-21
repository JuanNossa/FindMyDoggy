"use strict";
// src/infrastructure/routes/WalletRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const Wallet_1 = require("../../domain/models/Wallet");
const router = (0, express_1.Router)();
// Endpoint para que admin obtenga todas las wallets
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const wallets = await Wallet_1.Wallet.findAll();
    res.json({ wallets });
}));
// Endpoint para que un usuario obtenga su wallet
router.get('/:user_id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user_id = Number(req.params.user_id);
    const wallet = await Wallet_1.Wallet.findByUserId(user_id);
    res.json({ wallet });
}));
// Endpoint para actualizar (solo admin) el saldo de una wallet
router.put('/:walletId', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const walletId = Number(req.params.walletId);
    // Para actualizar por user_id, podrías buscar la wallet primero y luego actualizar
    const { balance } = req.body;
    // Asumimos que se pasa user_id en body para identificar la wallet
    const user_id = Number(req.body.user_id);
    const success = await Wallet_1.Wallet.updateBalance(user_id, balance);
    res.json({ message: success ? 'Wallet actualizada' : 'Error al actualizar wallet' });
}));
exports.default = router;
