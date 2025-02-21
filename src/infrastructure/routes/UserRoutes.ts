// src/infrastructure/routes/UserRoutes.ts

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../application/middlewares/asyncHandler';
import dbConfig from '../../infrastructure/database/dbConfig'; 
import { User } from '../../domain/models/User';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /api/users
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const pool = dbConfig.getPool();
  // LEFT JOIN wallets para traer wallet_balance
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email, u.password, u.role, w.balance AS wallet_balance
    FROM users u
    LEFT JOIN wallets w ON u.id = w.user_id
  `);
  res.json({ users: rows });
}));

/**
 * PUT /api/users/changePassword
 * Body: { userId, oldPassword, newPassword }
 */
router.put('/changePassword', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId, oldPassword, newPassword } = req.body;
  const user = await User.findById(Number(userId));
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  // Verificar la contraseña anterior
  const match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    res.status(400).json({ message: 'Contraseña anterior incorrecta' });
    return;
  }
  // Actualizar la contraseña
  const hashed = bcrypt.hashSync(newPassword, 10);
  await User.update(Number(userId), { password: hashed });
  res.json({ message: 'Contraseña actualizada' });
}));

/**
 * DELETE /api/users/deleteAccount
 * Body: { userId, password }
 */
router.delete('/deleteAccount', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId, password } = req.body;
  const user = await User.findById(Number(userId));
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  // Verificar la contraseña actual
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    res.status(400).json({ message: 'Contraseña incorrecta' });
    return;
  }
  // Eliminar usuario
  const success = await User.delete(Number(userId));
  res.json({ message: success ? 'Cuenta eliminada' : 'No se pudo eliminar la cuenta' });
}));

export default router;