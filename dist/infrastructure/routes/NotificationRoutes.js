"use strict";
// src/infrastructure/routes/NotificationRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo de rutas para el módulo de Notificaciones.
 * Define endpoints para crear notificaciones y obtener las notificaciones de un usuario.
 */
const express_1 = require("express");
const NotificationController_1 = require("../../application/controllers/NotificationController");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const router = (0, express_1.Router)();
// Endpoint para crear una notificación (y enviar correo)
// Se espera que el body incluya: user_id, email y message.
router.post('/', (0, asyncHandler_1.asyncHandler)(NotificationController_1.NotificationController.create));
// Endpoint para obtener notificaciones de un usuario, pasando su ID como parámetro
router.get('/:user_id', (0, asyncHandler_1.asyncHandler)(NotificationController_1.NotificationController.getByUser));
exports.default = router;
