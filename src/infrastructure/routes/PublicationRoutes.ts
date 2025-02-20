// src/infrastructure/routes/PublicationRoutes.ts

import { Router } from 'express';
import { PublicationController } from '../../application/controllers/PublicationController';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { upload } from '../../infrastructure/upload/upload';

const router = Router();

router.post('/', upload.single('image'), asyncHandler(PublicationController.create));
router.get('/', asyncHandler(PublicationController.getAll));
router.get('/:id', asyncHandler(PublicationController.getById));
router.put('/:id', asyncHandler(PublicationController.update));
router.delete('/:id', asyncHandler(PublicationController.delete));

export default router;