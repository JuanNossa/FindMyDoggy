"use strict";
// src/infrastructure/routes/UserRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
const User_1 = require("../../domain/models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// GET /api/users
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pool = dbConfig_1.default.getPool();
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
router.put('/changePassword', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User_1.User.findById(Number(userId));
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    // Verificar la contraseña anterior
    const match = bcryptjs_1.default.compareSync(oldPassword, user.password);
    if (!match) {
        res.status(400).json({ message: 'Contraseña anterior incorrecta' });
        return;
    }
    // Actualizar la contraseña
    const hashed = bcryptjs_1.default.hashSync(newPassword, 10);
    await User_1.User.update(Number(userId), { password: hashed });
    res.json({ message: 'Contraseña actualizada' });
}));
// ✅ PUT /api/users/toggleStatus/:id - Cambia estado de usuario
router.put('/toggleStatus/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.id);
    const pool = dbConfig_1.default.getPool();
    const [userRows] = await pool.query('SELECT estado_usuario FROM users WHERE id = ?', [userId]);
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
exports.default = router;
