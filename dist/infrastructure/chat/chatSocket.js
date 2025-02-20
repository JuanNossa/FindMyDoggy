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
/**
 * Middleware para validar JWT en el handshake de Socket.IO.
 */
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
        return next(new Error("Authentication error: Token missing"));
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secretKey');
        // Guardar la información del usuario en socket.data
        socket.data.user = user;
        next();
    }
    catch (err) {
        next(new Error("Authentication error: Invalid token"));
    }
}
/**
 * Inicializa el chat y maneja los eventos.
 * @param io Instancia del servidor Socket.IO.
 */
function initChat(io) {
    // Usar el middleware de autenticación para Socket.IO
    io.use(socketAuthMiddleware);
    io.on('connection', (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}, usuario: ${JSON.stringify(socket.data.user)}`);
        // Evento para que un usuario se una a una sala
        socket.on('joinRoom', async (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} se unió a la sala: ${room}`);
            io.to(room).emit('chatMessage', { sender: 'Sistema', message: `El usuario ${socket.data.user.userId} se ha unido a la sala.` });
            // Opcional: enviar el historial de chat
            const history = await ChatMessage_1.ChatMessage.findByRoom(room);
            socket.emit('chatHistory', history);
        });
        // Evento para recibir un mensaje de chat
        socket.on('chatMessage', async (data) => {
            console.log(`Mensaje recibido de ${data.sender} en sala ${data.room}: ${data.message}`);
            // Guardar el mensaje en la base de datos
            await ChatMessage_1.ChatMessage.create(new ChatMessage_1.ChatMessage(data.room, data.sender, data.message));
            // Emitir el mensaje a todos los clientes de la sala
            io.to(data.room).emit('chatMessage', data);
        });
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
}
