"use strict";
// src/domain/models/User.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
class User {
    constructor(name, email, password, role = 'user') {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    static async create(user) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [user.name, user.email, user.password, user.role]);
        user.id = result.insertId;
        return user;
    }
    static async findAll() {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    }
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
    static async update(id, data) {
        const pool = dbConfig_1.default.getPool();
        let query = 'UPDATE users SET ';
        const fields = [];
        const values = [];
        if (data.name) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.email) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data.password) {
            fields.push('password = ?');
            values.push(data.password);
        }
        if (data.role) {
            fields.push('role = ?');
            values.push(data.role);
        }
        if (fields.length === 0) {
            return User.findById(id);
        }
        query += fields.join(', ') + ' WHERE id = ?';
        values.push(id);
        await pool.query(query, values);
        return User.findById(id);
    }
    static async delete(id) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    /**
   * Busca un usuario por su correo electrónico.
   * @param email Correo del usuario a buscar.
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
}
exports.User = User;
