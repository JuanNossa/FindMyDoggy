"use strict";
// src/infrastructure/middleware/multerConfig.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configuración de Multer para manejar la carga de imágenes.
 * Se guardarán en la carpeta "uploads/" y se renombrarán para evitar conflictos.
 */
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configurar el almacenamiento para indicar dónde se guardan las imágenes
const storage = multer_1.default.diskStorage({
    /**
     * destination: define la carpeta donde se guardarán los archivos subidos.
     * @param req - Request de Express
     * @param file - Archivo que se está subiendo
     * @param cb - Callback para indicar el destino
     */
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../../uploads'));
    },
    /**
     * filename: define cómo se nombrarán los archivos subidos.
     * @param req - Request de Express
     * @param file - Archivo que se está subiendo
     * @param cb - Callback para indicar el nombre
     */
    filename: (req, file, cb) => {
        // Se usa la fecha + nombre original para evitar conflictos
        cb(null, Date.now() + '-' + file.originalname);
    }
});
/**
 * fileFilter: valida que el archivo sea una imagen.
 * @param req - Request de Express
 * @param file - Archivo que se está subiendo
 * @param cb - Callback para aprobar o rechazar el archivo
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};
// Crear la instancia de Multer con las configuraciones anteriores
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5 MB
});
exports.default = upload;
