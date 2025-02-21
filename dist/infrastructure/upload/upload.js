"use strict";
// src/infrastructure/upload/upload.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
/**
 * Configuración de Multer para la subida de imágenes.
 * Se guardarán en la carpeta "public/uploads" ubicada en la raíz del proyecto.
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // __dirname en compilación es "dist/infrastructure/upload"
        // Subir tres niveles para llegar a la raíz y luego "public/uploads"
        cb(null, path_1.default.join(__dirname, '../../..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Generar un nombre único usando timestamp y número aleatorio
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten archivos de tipo imagen.'), false);
    }
};
exports.upload = (0, multer_1.default)({ storage, fileFilter });
