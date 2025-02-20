"use strict";
// src/application/controllers/PublicationController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationController = void 0;
const Publication_1 = require("../../domain/models/Publication");
class PublicationController {
    /**
     * Crea una nueva publicación.
     */
    static async create(req, res) {
        try {
            const { title, description, reward, user_id, location_id } = req.body;
            const publication = new Publication_1.Publication(title, description, reward, user_id, location_id);
            const newPublication = await Publication_1.Publication.create(publication);
            res.status(201).json({ message: 'Publicación creada exitosamente', publication: newPublication });
            return;
        }
        catch (error) {
            console.error('Error en PublicationController.create:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Retorna todas las publicaciones.
     */
    static async getAll(req, res) {
        try {
            const publications = await Publication_1.Publication.findAll();
            res.json({ publications });
            return;
        }
        catch (error) {
            console.error('Error en PublicationController.getAll:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Retorna una publicación por su ID.
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const publication = await Publication_1.Publication.findById(Number(id));
            if (!publication) {
                res.status(404).json({ message: 'Publicación no encontrada' });
                return;
            }
            res.json({ publication });
            return;
        }
        catch (error) {
            console.error('Error en PublicationController.getById:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Actualiza una publicación.
     * Permite la modificación solo si el usuario es el autor o es administrador.
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const loggedUser = req.user; // Inyectado por el middleware JWT
            const publication = await Publication_1.Publication.findById(Number(id));
            if (!publication) {
                res.status(404).json({ message: 'Publicación no encontrada' });
                return;
            }
            // Verifica que el usuario sea el autor o admin
            if (loggedUser.role !== 'admin' && publication.user_id !== loggedUser.userId) {
                res.status(403).json({ message: 'No tienes permisos para editar esta publicación' });
                return;
            }
            const updatedPublication = await Publication_1.Publication.update(Number(id), req.body);
            res.json({ message: 'Publicación actualizada', publication: updatedPublication });
            return;
        }
        catch (error) {
            console.error('Error en PublicationController.update:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Elimina una publicación.
     * Permite la eliminación solo si el usuario es el autor o es administrador.
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const loggedUser = req.user;
            const publication = await Publication_1.Publication.findById(Number(id));
            if (!publication) {
                res.status(404).json({ message: 'Publicación no encontrada' });
                return;
            }
            // Verifica que el usuario sea el autor o admin
            if (loggedUser.role !== 'admin' && publication.user_id !== loggedUser.userId) {
                res.status(403).json({ message: 'No tienes permisos para eliminar esta publicación' });
                return;
            }
            const success = await Publication_1.Publication.delete(Number(id));
            if (!success) {
                res.status(404).json({ message: 'Publicación no encontrada para eliminar' });
                return;
            }
            res.json({ message: 'Publicación eliminada correctamente' });
            return;
        }
        catch (error) {
            console.error('Error en PublicationController.delete:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
}
exports.PublicationController = PublicationController;
