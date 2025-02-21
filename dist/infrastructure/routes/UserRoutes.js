"use strict";
// src/infrastructure/routes/UserRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const User_1 = require("../../domain/models/User");
const router = (0, express_1.Router)();
// GET /api/users - Lista todos los usuarios
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await User_1.User.findAll();
    res.json({ users });
}));
// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const updatedUser = await User_1.User.update(Number(id), { name, email, password, role });
    res.json({ message: 'Usuario actualizado', user: updatedUser });
}));
// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const success = await User_1.User.delete(Number(id));
    res.json({ message: success ? 'Usuario eliminado' : 'No se pudo eliminar' });
}));
exports.default = router;
