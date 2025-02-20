"use strict";
// src/application/middlewares/adminMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    // Extraer la información del usuario inyectada por el middleware de autenticación
    const user = req.user;
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
exports.adminMiddleware = adminMiddleware;
