"use strict";
// src/domain/models/Notification.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
/**
 * Modelo para las notificaciones.
 * Representa la estructura de la tabla 'notifications' en la base de datos.
 * Provee métodos para crear una notificación y buscar notificaciones por usuario.
 */
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
class Notification {
    /**
     * Constructor para crear una instancia de Notification.
     * @param user_id ID del usuario que recibirá la notificación.
     * @param message Contenido del mensaje de la notificación.
     */
    constructor(user_id, message) {
        this.user_id = user_id;
        this.message = message;
    }
    /**
     * Inserta una nueva notificación en la base de datos.
     * @param notification Instancia de Notification a insertar.
     * @returns La notificación creada con su ID asignado.
     */
    static async create(notification) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())', [notification.user_id, notification.message]);
        notification.id = result.insertId;
        return notification;
    }
    /**
     * Busca todas las notificaciones de un usuario.
     * @param user_id ID del usuario.
     * @returns Un array de notificaciones asociadas al usuario.
     */
    static async findByUserId(user_id) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ?', [user_id]);
        return rows;
    }
}
exports.Notification = Notification;
