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
    /**
     * Inserta un mensaje de chat en la base de datos.
     * @param chatMessage Instancia de ChatMessage a guardar.
     * @returns La instancia con el ID asignado.
     */
    static async create(chatMessage) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('INSERT INTO chat_messages (room, sender, message, created_at) VALUES (?, ?, ?, NOW())', [chatMessage.room, chatMessage.sender, chatMessage.message]);
        chatMessage.id = result.insertId;
        return chatMessage;
    }
    /**
     * Retorna todos los mensajes de un chat (sala) específico.
     * @param room Nombre de la sala.
     * @returns Un array de ChatMessage.
     */
    static async findByRoom(room) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM chat_messages WHERE room = ? ORDER BY created_at ASC', [room]);
        return rows;
    }
}
exports.ChatMessage = ChatMessage;
