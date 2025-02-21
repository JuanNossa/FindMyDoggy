"use strict";
// src/infrastructure/routes/CommentRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo de rutas para el módulo de comentarios.
 * Define endpoints para crear, consultar, actualizar y eliminar comentarios.
 */
const express_1 = require("express");
const CommentController_1 = require("../../application/controllers/CommentController");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const router = (0, express_1.Router)();
// Endpoint para crear un comentario
router.post('/', (0, asyncHandler_1.asyncHandler)(CommentController_1.CommentController.create));
// Endpoint para obtener todos los comentarios de una publicación
// Se espera que la ruta sea: /api/comments/publication/:publication_id
router.get('/publication/:pubId', (0, asyncHandler_1.asyncHandler)(CommentController_1.CommentController.getByPublication));
// Endpoint para actualizar un comentario por su ID
router.put('/:id', (0, asyncHandler_1.asyncHandler)(CommentController_1.CommentController.update));
// Endpoint para eliminar un comentario por su ID
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(CommentController_1.CommentController.delete));
exports.default = router;
