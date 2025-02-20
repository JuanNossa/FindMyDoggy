"use strict";
// src/application/middlewares/authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secretKey');
        // Agregar la información del usuario al objeto request
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
exports.authMiddleware = authMiddleware;
