// src/application/middlewares/asyncHandler.ts

/**
 * asyncHandler: Helper que envuelve funciones asíncronas para que cualquier error se pase al middleware next().
 * Esto permite que Express maneje errores de forma centralizada.
 *
 * @param fn Función asíncrona que actúa como RequestHandler.
 * @returns Una función RequestHandler que captura y maneja errores.
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
