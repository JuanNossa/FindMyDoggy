// src/infrastructure/upload/upload.ts

/**
 * Configuración de Multer para la subida de imágenes.
 * Se define el destino (carpeta "public/uploads") y se renombra el archivo para evitar conflictos.
 * Se filtran solo archivos con mimetype que comience con 'image/'.
 */

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guardar en la carpeta "public/uploads"
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Renombrar el archivo con timestamp + nombre original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Convertir a 'Error' con type assertion si TypeScript se queja
    cb(new Error('Solo se permiten archivos de tipo imagen.') as any, false);
  }
};

export const upload = multer({ storage, fileFilter });