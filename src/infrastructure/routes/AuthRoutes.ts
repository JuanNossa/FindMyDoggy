// src/infrastructure/routes/AuthRoutes.ts

/**
 * Archivo de rutas para la autenticación de usuarios.
 * Se definen los endpoints para registrar e iniciar sesión, envolviendo los controladores async con asyncHandler.
 */

import { Router } from 'express';
import { AuthController } from '../../application/controllers/AuthController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';

const router = Router();

// Endpoint para registrar un nuevo usuario, envuelto en asyncHandler
router.post('/register', asyncHandler(AuthController.register));

// Endpoint para iniciar sesión y obtener un token JWT, envuelto en asyncHandler
router.post('/login', asyncHandler(AuthController.login));

export default router;
