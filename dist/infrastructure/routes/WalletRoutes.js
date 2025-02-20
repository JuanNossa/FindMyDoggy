"use strict";
// src/infrastructure/routes/WalletRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo de rutas para el módulo de Wallet/Coins.
 * Define endpoints para consultar la wallet, comprar coins y transferir coins.
 */
const express_1 = require("express");
const WalletController_1 = require("../../application/controllers/WalletController");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const router = (0, express_1.Router)();
// Endpoint para consultar la wallet de un usuario por su ID (pasado en params)
router.get('/:user_id', (0, asyncHandler_1.asyncHandler)(WalletController_1.WalletController.getWallet));
// Endpoint para simular la compra de coins (se envía user_id y amountCOP en el body)
router.post('/buy', (0, asyncHandler_1.asyncHandler)(WalletController_1.WalletController.buyCoins));
// Endpoint para transferir coins de un usuario a otro (se envía from_user_id, to_user_id y amount en el body)
router.post('/transfer', (0, asyncHandler_1.asyncHandler)(WalletController_1.WalletController.transferCoins));
exports.default = router;
