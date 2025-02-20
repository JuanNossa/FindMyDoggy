"use strict";
// src/infrastructure/routes/AuthRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo de rutas para la autenticación de usuarios.
 * Se definen los endpoints para registrar e iniciar sesión, envolviendo los controladores async con asyncHandler.
 */
const express_1 = require("express");
const AuthController_1 = require("../../application/controllers/AuthController");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const router = (0, express_1.Router)();
// Endpoint para registrar un nuevo usuario, envuelto en asyncHandler
router.post('/register', (0, asyncHandler_1.asyncHandler)(AuthController_1.AuthController.register));
// Endpoint para iniciar sesión y obtener un token JWT, envuelto en asyncHandler
router.post('/login', (0, asyncHandler_1.asyncHandler)(AuthController_1.AuthController.login));
exports.default = router;
