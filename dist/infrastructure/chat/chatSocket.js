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
 * Inicializa la lógica de chat en tiempo real con Socket.IO.
 * Se generan rooms con el formato minID_maxID, y se guardan los mensajes en la base de datos.
 */
function initChat(io) {
    io.on('connection', (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);
        /**
         * Manejo de "joinRoom":
         * El front enviará un objeto { fromId, toId } y aquí calculamos la sala minID_maxID.
         * Luego cargamos el historial y lo enviamos con "chatHistory".
         */
        socket.on('joinRoom', async (payload) => {
            try {
                // Calcular room
                const minId = Math.min(payload.fromId, payload.toId);
                const maxId = Math.max(payload.fromId, payload.toId);
                const room = `${minId}_${maxId}`;
                socket.join(room);
                console.log(`Socket ${socket.id} se unió a la sala: ${room}`);
                // Cargar historial
                const history = await ChatMessage_1.ChatMessage.findByRoom(room);
                socket.emit('chatHistory', history);
            }
            catch (err) {
                console.error('Error en joinRoom:', err);
            }
        });
        /**
         * Manejo de "chatMessage":
         * El front enviará { fromId, toId, message }, y aquí calculamos la sala minID_maxID,
         * guardamos el mensaje en la DB y lo emitimos a la sala.
         */
        socket.on('chatMessage', async (data) => {
            try {
                const minId = Math.min(data.fromId, data.toId);
                const maxId = Math.max(data.fromId, data.toId);
                const room = `${minId}_${maxId}`;
                console.log(`Mensaje recibido en sala ${room}: ${data.message}`);
                // Guardar en la base de datos
                await ChatMessage_1.ChatMessage.create({
                    room,
                    sender: String(data.fromId),
                    message: data.message
                });
                // Emitir el mensaje a todos los clientes de la sala
                io.to(room).emit('chatMessage', {
                    sender: data.fromId,
                    message: data.message
                });
            }
            catch (err) {
                console.error('Error en chatMessage:', err);
            }
        });
        // Manejo de desconexión
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
}
