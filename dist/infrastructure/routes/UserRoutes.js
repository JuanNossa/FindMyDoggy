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
/**
 * DELETE /api/users/deleteAccount
 * Body: { userId, password }
 */
router.delete('/deleteAccount', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, password } = req.body;
    const user = await User_1.User.findById(Number(userId));
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    // Verificar la contraseña actual
    const match = bcryptjs_1.default.compareSync(password, user.password);
    if (!match) {
        res.status(400).json({ message: 'Contraseña incorrecta' });
        return;
    }
    // Eliminar usuario
    const success = await User_1.User.delete(Number(userId));
    res.json({ message: success ? 'Cuenta eliminada' : 'No se pudo eliminar la cuenta' });
}));
exports.default = router;
