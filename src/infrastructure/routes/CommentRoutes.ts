// src/infrastructure/routes/CommentRoutes.ts

/**
 * Archivo de rutas para el módulo de comentarios.
 * Define endpoints para crear, consultar, actualizar y eliminar comentarios.
 */

import { Router } from 'express';
import { CommentController } from '../../application/controllers/CommentController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';

const router = Router();

// Endpoint para crear un comentario
router.post('/', asyncHandler(CommentController.create));

// Endpoint para obtener todos los comentarios de una publicación
// Se espera que la ruta sea: /api/comments/publication/:publication_id
router.get('/publication/:publication_id', asyncHandler(CommentController.getByPublication));

// Endpoint para actualizar un comentario por su ID
router.put('/:id', asyncHandler(CommentController.update));

// Endpoint para eliminar un comentario por su ID
router.delete('/:id', asyncHandler(CommentController.delete));

export default router;