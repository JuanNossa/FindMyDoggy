"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const ChatMessage_1 = require("../../domain/models/ChatMessage");
class ChatController {
    /**
     * Crea o reutiliza una sala entre dos usuarios.
     */
    static async createRoom(fromId, toId) {
        const minId = Math.min(fromId, toId);
        const maxId = Math.max(fromId, toId);
        const room = `${minId}_${maxId}`;
        return room;
    }
    /**
     * Obtiene todas las salas en las que participa un usuario.
     */
    static async getUserChats(req, res) {
        try {
            const userId = Number(req.query.userId);
            if (!userId) {
                res.status(400).json({ message: 'Falta userId' });
                return;
            }
            const rooms = await ChatMessage_1.ChatMessage.findRoomsByUser(userId);
            res.json({ chats: rooms });
        }
        catch (error) {
            console.error('❌ Error en ChatController.getUserChats:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ChatController = ChatController;
