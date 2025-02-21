// src/infrastructure/routes/UserRoutes.ts

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { User } from '../../domain/models/User';

const router = Router();

// GET /api/users - Lista todos los usuarios
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json({ users });
}));

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const updatedUser = await User.update(Number(id), { name, email, password, role });
  res.json({ message: 'Usuario actualizado', user: updatedUser });
}));

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const success = await User.delete(Number(id));
  res.json({ message: success ? 'Usuario eliminado' : 'No se pudo eliminar' });
}));

export default router;