"use strict";
// src/infrastructure/chat/chatSocket.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = socketAuthMiddleware;
exports.initChat = initChat;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const ChatMessage_1 = require("../../domain/models/ChatMessage");
dotenv_1.default.config();
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token)
        return next(new Error('❌ Authentication error: Token missing'));
    try {
        socket.data.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secretKey');
        next();
    }
    catch {
        next(new Error('❌ Authentication error: Invalid token'));
    }
}
function initChat(io) {
    io.use(socketAuthMiddleware);
    io.on('connection', (socket) => {
        console.log(`✅ Nuevo cliente conectado: ${socket.id}`);
        socket.on('joinRoom', async ({ fromId, toId }) => {
            const room = `${Math.min(fromId, toId)}_${Math.max(fromId, toId)}`;
            socket.join(room);
            console.log(`🚪 Socket ${socket.id} se unió a la sala: ${room}`);
            const history = await ChatMessage_1.ChatMessage.findByRoom(room);
            socket.emit('chatHistory', history);
        });
        socket.on('chatMessage', async ({ fromId, toId, message }) => {
            const room = `${Math.min(fromId, toId)}_${Math.max(fromId, toId)}`;
            await ChatMessage_1.ChatMessage.create(new ChatMessage_1.ChatMessage(room, String(fromId), message));
            io.to(room).emit('chatMessage', { sender: fromId, message });
            console.log(`📨 Mensaje enviado a sala ${room}: ${message}`);
        });
        socket.on('disconnect', () => {
            console.log(`🚪 Cliente desconectado: ${socket.id}`);
        });
    });
}
