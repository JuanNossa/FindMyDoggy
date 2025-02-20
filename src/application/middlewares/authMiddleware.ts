// src/application/middlewares/authMiddleware.ts

/**
 * Middleware para validar el token JWT en las rutas protegidas.
 * Verifica la presencia y validez del token en la cabecera 'Authorization'.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtener el token desde el header 'Authorization'
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  // Se espera el formato 'Bearer <token>'
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no válido' });
  }

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey') as any;
    // Agregar la información del usuario al objeto request
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
