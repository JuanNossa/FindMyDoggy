// src/infrastructure/routes/NotificationRoutes.ts

/**
 * Archivo de rutas para el módulo de Notificaciones.
 * Define endpoints para crear notificaciones y obtener las notificaciones de un usuario.
 */

import { Router } from 'express';
import { NotificationController } from '../../application/controllers/NotificationController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';

const router = Router();

// Endpoint para crear una notificación (y enviar correo)
// Se espera que el body incluya: user_id, email y message.
router.post('/', asyncHandler(NotificationController.create));

// Endpoint para obtener notificaciones de un usuario, pasando su ID como parámetro
router.get('/:user_id', asyncHandler(NotificationController.getByUser));

export default router;