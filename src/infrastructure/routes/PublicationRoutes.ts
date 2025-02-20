// src/infrastructure/routes/PublicationRoutes.ts

/**
 * Archivo de rutas para el CRUD de publicaciones.
 * Se definen los endpoints para crear, obtener, actualizar y eliminar publicaciones.
 */

import { Router } from 'express';
import { PublicationController } from '../../application/controllers/PublicationController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { upload } from '../../infrastructure/upload/upload';

const router = Router();

// Para crear una publicación que incluya una imagen, usar upload.single('image')
router.post('/', upload.single('image'), asyncHandler(PublicationController.create));
// Las demás rutas se mantienen igual...
router.get('/', asyncHandler(PublicationController.getAll));
router.get('/:id', asyncHandler(PublicationController.getById));
router.put('/:id', asyncHandler(PublicationController.update));
router.delete('/:id', asyncHandler(PublicationController.delete));

export default router;
