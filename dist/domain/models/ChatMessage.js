"use strict";
// src/domain/models/ChatMessage.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
/**
 * Modelo para los mensajes del chat.
 * Representa la estructura de la tabla 'chat_messages' en la base de datos.
 * Permite almacenar y consultar el historial de mensajes.
 */
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
class ChatMessage {
    constructor(room, sender, message) {
        this.room = room;
        this.sender = sender;
        this.message = message;
    }
    // Crea un mensaje en la DB
    static async create(chatMessage) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query(`INSERT INTO chat_messages (room, sender, message, created_at)
       VALUES (?, ?, ?, NOW())`, [chatMessage.room, chatMessage.sender, chatMessage.message]);
        chatMessage.id = result.insertId;
        return chatMessage;
    }
    // Retorna todos los mensajes de una sala
    static async findByRoom(room) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query(`SELECT * FROM chat_messages WHERE room = ? ORDER BY created_at ASC`, [room]);
        return rows;
    }
    // Encuentra las rooms en las que participa un userId
    static async findRoomsByUser(userId) {
        const pool = dbConfig_1.default.getPool();
        // Aquí asumimos que "sender" es un string con el userId
        const [rows] = await pool.query(`SELECT DISTINCT room
       FROM chat_messages
       WHERE sender = ?`, [String(userId)]);
        return rows;
    }
}
exports.ChatMessage = ChatMessage;
