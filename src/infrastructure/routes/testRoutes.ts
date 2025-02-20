// src/infrastructure/routes/testRoutes.ts

/**
 * Archivo de rutas de prueba para verificar la conexión y funcionamiento de la API.
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Ruta GET /api/test/
 * Responde con un mensaje de confirmación.
 */
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Ruta de prueba funcionando correctamente.' });
});

export default router;