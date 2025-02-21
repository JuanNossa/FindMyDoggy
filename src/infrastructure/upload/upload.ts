// src/infrastructure/upload/upload.ts

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * Configuración de Multer para la subida de imágenes.
 * Se guardarán en la carpeta "public/uploads" ubicada en la raíz del proyecto.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // __dirname en compilación es "dist/infrastructure/upload"
    // Subir tres niveles para llegar a la raíz y luego "public/uploads"
    cb(null, path.join(__dirname, '../../..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Generar un nombre único usando timestamp y número aleatorio
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de tipo imagen.') as any, false);
  }
};

export const upload = multer({ storage, fileFilter });