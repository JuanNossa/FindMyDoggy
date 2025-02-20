// src/application/middlewares/adminMiddleware.ts

/**
 * Middleware para verificar que el usuario autenticado tenga rol 'admin'.
 * Se asume que, tras la validación del JWT, la información del usuario se ha guardado en req.user.
 * Si el usuario no tiene rol de administrador, se retorna un error 403.
 */

import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Extraer la información del usuario inyectada por el middleware de autenticación
  const user = (req as any).user;
  
  // Si no se encuentra la información del usuario, se retorna un error 401 (no autorizado)
  if (!user) {
    res.status(401).json({ message: 'No se encontró información del usuario.' });
    return;
  }

  // Verificar que el usuario tenga rol "admin"
  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Acceso restringido. Se requiere rol de administrador.' });
    return;
  }

  // Si la verificación es exitosa, se llama a next() para continuar con la siguiente función del middleware o controlador
  next();
};