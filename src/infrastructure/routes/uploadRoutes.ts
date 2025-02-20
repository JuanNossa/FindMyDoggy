// src/infrastructure/routes/uploadRoutes.ts

/**
 * Rutas para manejar la carga de archivos (imágenes) usando Multer.
 * El campo del formulario debe llamarse "image".
 */

// src/infrastructure/routes/uploadRoutes.ts

// src/infrastructure/routes/uploadRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../../infrastructure/upload/upload'; // Ajusta la ruta según tu estructura

const router = Router();

/**
 * Endpoint para subir una imagen.
 * Se usa `upload.single('image')` para procesar el campo "image" del formulario.
 */
router.post('/', upload.single('image'), (req: Request, res: Response, next: NextFunction): void => {
  // Si no se subió ningún archivo, retornar error
  if (!req.file) {
    res.status(400).json({ message: 'No se subió ninguna imagen.' });
    return;
  }

  // Responder con los datos del archivo
  res.json({
    message: 'Imagen subida con éxito',
    file: req.file
  });
  // No retornamos nada más (void)
});

export default router;

