"use strict";
// src/infrastructure/upload/upload.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
/**
 * Configuración de Multer para la subida de imágenes.
 * Se define el destino (carpeta "public/uploads") y se renombra el archivo para evitar conflictos.
 * Se filtran solo archivos con mimetype que comience con 'image/'.
 */
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configurar almacenamiento
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Guardar en la carpeta "public/uploads"
        cb(null, path_1.default.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        // Renombrar el archivo con timestamp + nombre original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        // Convertir a 'Error' con type assertion si TypeScript se queja
        cb(new Error('Solo se permiten archivos de tipo imagen.'), false);
    }
};
exports.upload = (0, multer_1.default)({ storage, fileFilter });
