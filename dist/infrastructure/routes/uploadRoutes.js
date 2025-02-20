"use strict";
// src/infrastructure/routes/uploadRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Rutas para manejar la carga de archivos (imágenes) usando Multer.
 * El campo del formulario debe llamarse "image".
 */
// src/infrastructure/routes/uploadRoutes.ts
// src/infrastructure/routes/uploadRoutes.ts
const express_1 = require("express");
const upload_1 = require("../../infrastructure/upload/upload"); // Ajusta la ruta según tu estructura
const router = (0, express_1.Router)();
/**
 * Endpoint para subir una imagen.
 * Se usa `upload.single('image')` para procesar el campo "image" del formulario.
 */
router.post('/', upload_1.upload.single('image'), (req, res, next) => {
    // Si no se subió ningún archivo, retornar error
    if (!req.file) {
        res.status(400).json({ message: 'No se subió ninguna imagen.' });
        return;
    }
    // Responder con los datos del archivo
    res.json({
        message: 'Imagen subida con éxito',
        file: req.file
    });
    // No retornamos nada más (void)
});
exports.default = router;
