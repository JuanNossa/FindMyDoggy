// src/infrastructure/routes/WalletRoutes.ts

/**
 * Archivo de rutas para el módulo de Wallet/Coins.
 * Define endpoints para consultar la wallet, comprar coins y transferir coins.
 */

import { Router } from 'express';
import { WalletController } from '../../application/controllers/WalletController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';

const router = Router();

// Endpoint para consultar la wallet de un usuario por su ID (pasado en params)
router.get('/:user_id', asyncHandler(WalletController.getWallet));

// Endpoint para simular la compra de coins (se envía user_id y amountCOP en el body)
router.post('/buy', asyncHandler(WalletController.buyCoins));

// Endpoint para transferir coins de un usuario a otro (se envía from_user_id, to_user_id y amount en el body)
router.post('/transfer', asyncHandler(WalletController.transferCoins));

export default router;