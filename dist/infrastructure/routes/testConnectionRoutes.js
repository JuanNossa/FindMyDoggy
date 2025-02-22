"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbConfig_1 = __importDefault(require("../database/dbConfig"));
const router = (0, express_1.Router)();
/**
 * Ruta para probar la conexión a la base de datos.
 */
router.get('/test-connection', async (_req, res) => {
    try {
        const pool = dbConfig_1.default.getPool();
        const connection = await pool.getConnection();
        await connection.ping(); // Verifica la conexión
        connection.release(); // Libera la conexión después de la prueba
        res.status(200).json({ success: true, message: 'Conexión exitosa a la base de datos.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error al conectar con la base de datos.', error });
    }
});
exports.default = router;
