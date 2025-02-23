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
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email, u.password, u.role, u.estado_usuario, w.balance AS wallet_balance
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

// ✅ PUT /api/users/toggleStatus/:id - Cambia estado de usuario
router.put('/toggleStatus/:id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  const pool = dbConfig.getPool();

  const [userRows]: any = await pool.query('SELECT estado_usuario FROM users WHERE id = ?', [userId]);
  if (!userRows.length) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  const newStatus = userRows[0].estado_usuario === 1 ? 2 : 1;
  await pool.query('UPDATE users SET estado_usuario = ? WHERE id = ?', [newStatus, userId]);

  res.status(200).json({
    message: `Usuario ${newStatus === 1 ? 'activado' : 'desactivado'} correctamente.`,
    newStatus // 👉 Se envía el nuevo estado al front
  });
}));

export default router;