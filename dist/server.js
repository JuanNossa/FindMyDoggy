"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo principal para iniciar el servidor de la aplicación.
 * Se crea un servidor HTTP a partir de la aplicación Express,
 * se integra Socket.IO y se inicializa el módulo de chat.
 */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const chatSocket_1 = require("./infrastructure/chat/chatSocket");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Crear el servidor HTTP usando la aplicación Express
const server = http_1.default.createServer(app_1.default);
// Inicializar Socket.IO con opciones de CORS (para desarrollo, se permite cualquier origen)
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Inicializar el chat con la instancia de Socket.IO
(0, chatSocket_1.initChat)(io);
// Iniciar el servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
