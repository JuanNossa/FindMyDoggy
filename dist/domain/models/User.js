"use strict";
// src/domain/models/User.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * Modelo para el usuario.
 * Representa la estructura de la tabla 'users' en la base de datos.
 * Incluye métodos estáticos para crear y buscar usuarios usando mysql2.
 */
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
class User {
    constructor(name, email, password, role = 'user') {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    /**
     * Inserta un nuevo usuario en la base de datos.
     * @param user Instancia de User a crear.
     * @returns La instancia del usuario con su ID asignado.
     */
    static async create(user) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [user.name, user.email, user.password, user.role]);
        user.id = result.insertId;
        return user;
    }
    /**
     * Busca un usuario por email.
     * @param email Email del usuario a buscar.
     * @returns Una instancia de User si se encuentra, o null en caso contrario.
     */
    static async findByEmail(email) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const results = rows;
        if (results.length > 0) {
            const row = results[0];
            const user = new User(row.name, row.email, row.password, row.role);
            user.id = row.id;
            return user;
        }
        return null;
    }
    /**
     * Busca un usuario por su ID.
     * @param id ID del usuario a buscar.
     * @returns Una instancia de User si se encuentra, o null en caso contrario.
     */
    static async findById(id) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        const results = rows;
        if (results.length > 0) {
            const row = results[0];
            const user = new User(row.name, row.email, row.password, row.role);
            user.id = row.id;
            return user;
        }
        return null;
    }
}
exports.User = User;
