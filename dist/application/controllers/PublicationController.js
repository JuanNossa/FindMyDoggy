"use strict";
// src/application/controllers/PublicationController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationController = void 0;
const Publication_1 = require("../../domain/models/Publication");
class PublicationController {
    static async create(req, res) {
        try {
            const { title, description, reward, user_id } = req.body;
            // Los campos opcionales se procesan de la siguiente manera:
            const location_id = req.body.location_id ? Number(req.body.location_id) : undefined;
            const latitude = req.body.latitude ? Number(req.body.latitude) : undefined;
            const longitude = req.body.longitude ? Number(req.body.longitude) : undefined;
            const image_path = req.file ? req.file.filename : undefined;
            const publication = new Publication_1.Publication(title, description, reward, Number(user_id), location_id, image_path, latitude, longitude);
            const newPublication = await Publication_1.Publication.create(publication);
            res.status(201).json({ message: 'Publicación creada exitosamente', publication: newPublication });
        }
        catch (error) {
            console.error('Error en PublicationController.create:', error);
            res.status(500).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const publications = await Publication_1.Publication.findAll();
            res.json({ publications });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const publication = await Publication_1.Publication.findById(Number(id));
            if (!publication) {
                res.status(404).json({ message: 'Publicación no encontrada' });
                return;
            }
            res.json({ publication });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            // Procesar campos opcionales para evitar valores null
            const data = {
                title: req.body.title,
                description: req.body.description,
                reward: req.body.reward,
                location_id: req.body.location_id ? Number(req.body.location_id) : undefined,
                latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
                longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
                image_path: req.file ? req.file.filename : undefined
            };
            const updatedPublication = await Publication_1.Publication.update(Number(id), data);
            if (!updatedPublication) {
                res.status(404).json({ message: 'Publicación no encontrada para actualizar' });
                return;
            }
            res.json({ message: 'Publicación actualizada', publication: updatedPublication });
        }
        catch (error) {
            console.error('Error en PublicationController.update:', error);
            res.status(500).json({ error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await Publication_1.Publication.delete(Number(id));
            if (!success) {
                res.status(404).json({ message: 'Publicación no encontrada para eliminar' });
                return;
            }
            res.json({ message: 'Publicación eliminada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PublicationController = PublicationController;
