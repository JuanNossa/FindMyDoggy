"use strict";
// src/infrastructure/database/dbConfig.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Este archivo configura la conexión a la base de datos MySQL usando mysql2 con el patrón Singleton.
 * Se asegura de que exista una única instancia de pool de conexiones en toda la aplicación.
 */
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno del archivo .env
dotenv_1.default.config();
class DBConfig {
    // Constructor privado para evitar instanciación externa
    constructor() { }
    /**
     * Retorna la instancia única del pool de conexiones.
     * Si aún no existe, la crea usando la configuración del archivo .env.
     */
    static getPool() {
        if (!DBConfig.pool) {
            DBConfig.pool = promise_1.default.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'findmydoggy_db',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
            console.log('Pool de conexiones a MySQL creado.');
        }
        return DBConfig.pool;
    }
}
exports.default = DBConfig;
