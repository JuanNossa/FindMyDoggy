"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Archivo principal de configuración de la aplicación Express.
 * Se configuran los middlewares, rutas y se exporta la aplicación.
 */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Agregar middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express_1.default.static('public'));
// Configuración de middlewares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// IMPORTANTE: parsear JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Importar rutas
const testRoutes_1 = __importDefault(require("./infrastructure/routes/testRoutes"));
const AuthRoutes_1 = __importDefault(require("./infrastructure/routes/AuthRoutes"));
const PublicationRoutes_1 = __importDefault(require("./infrastructure/routes/PublicationRoutes"));
const WalletRoutes_1 = __importDefault(require("./infrastructure/routes/WalletRoutes"));
const CommentRoutes_1 = __importDefault(require("./infrastructure/routes/CommentRoutes"));
const NotificationRoutes_1 = __importDefault(require("./infrastructure/routes/NotificationRoutes"));
const uploadRoutes_1 = __importDefault(require("./infrastructure/routes/uploadRoutes"));
const ChatRoutes_1 = __importDefault(require("./infrastructure/routes/ChatRoutes"));
const UserRoutes_1 = __importDefault(require("./infrastructure/routes/UserRoutes"));
// Montar rutas
app.use('/api/test', testRoutes_1.default);
app.use('/api/auth', AuthRoutes_1.default);
app.use('/api/publications', PublicationRoutes_1.default);
app.use('/api/wallet', WalletRoutes_1.default);
app.use('/api/comments', CommentRoutes_1.default);
app.use('/api/notifications', NotificationRoutes_1.default);
app.use('/api/uploads', uploadRoutes_1.default);
app.use('/api/chats', ChatRoutes_1.default);
app.use('/api/users', UserRoutes_1.default);
// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido a FindMyDoggy API');
});
exports.default = app;
