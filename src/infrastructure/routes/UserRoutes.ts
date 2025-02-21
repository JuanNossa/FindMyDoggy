// src/infrastructure/routes/UserRoutes.ts
import { Router } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import { User } from '../../domain/models/User';

const router = Router();

// GET /api/users
router.get('/', asyncHandler(async (req, res) => {
  // Valida si admin
  const users = await User.findAll();
  res.json({ users });
}));

// PUT /api/users/:id para editar
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const updatedUser = await User.update(Number(id), { name, email, password, role });
  res.json({ message: 'Usuario actualizado', user: updatedUser });
}));

// DELETE /api/users/:id para eliminar
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const success = await User.delete(Number(id));
  res.json({ message: success ? 'Usuario eliminado' : 'No se pudo eliminar' });
}));

export default router;