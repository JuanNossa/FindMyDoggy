"use strict";
// src/infrastructure/routes/testRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo de rutas de prueba para verificar la conexión y funcionamiento de la API.
 */
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * Ruta GET /api/test/
 * Responde con un mensaje de confirmación.
 */
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de prueba funcionando correctamente.' });
});
exports.default = router;
