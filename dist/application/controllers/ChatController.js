"use strict";
// src/application/controllers/ChatController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const ChatMessage_1 = require("../../domain/models/ChatMessage");
class ChatController {
    /**
     * Retorna las salas (rooms) en las que participa un usuario,
     * basándonos en los mensajes que ha enviado o recibido.
     */
    static async getUserChats(req, res) {
        try {
            const userId = Number(req.query.userId);
            if (!userId) {
                res.status(400).json({ message: 'Falta userId' });
                return;
            }
            // Obtener las rooms de chat_messages donde el sender sea userId o donde la sala se asocie a userId
            // En una implementación real, deberías tener otra tabla para las salas. Aquí, un approach simplificado:
            const rooms = await ChatMessage_1.ChatMessage.findRoomsByUser(userId);
            res.json({ chats: rooms });
        }
        catch (error) {
            console.error('Error en ChatController.getUserChats:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ChatController = ChatController;
