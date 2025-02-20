"use strict";
// src/application/controllers/CommentController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const Comment_1 = require("../../domain/models/Comment");
class CommentController {
    /**
     * Crea un nuevo comentario para una publicación.
     */
    static async create(req, res) {
        try {
            const { publication_id, user_id, content } = req.body;
            if (!publication_id || !user_id || !content) {
                res.status(400).json({ message: 'Se requieren publication_id, user_id y content' });
                return;
            }
            const comment = new Comment_1.Comment(publication_id, user_id, content);
            const newComment = await Comment_1.Comment.create(comment);
            res.status(201).json({ message: 'Comentario creado exitosamente', comment: newComment });
            return;
        }
        catch (error) {
            console.error('Error en CommentController.create:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Retorna todos los comentarios de una publicación.
     */
    static async getByPublication(req, res) {
        try {
            const { publication_id } = req.params;
            const comments = await Comment_1.Comment.findByPublicationId(Number(publication_id));
            res.json({ comments });
            return;
        }
        catch (error) {
            console.error('Error en CommentController.getByPublication:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Actualiza el contenido de un comentario.
     * Permite la edición solo si el usuario es el autor o es administrador.
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const loggedUser = req.user;
            const { content } = req.body;
            if (!content) {
                res.status(400).json({ message: 'Se requiere el nuevo contenido' });
                return;
            }
            const comment = await Comment_1.Comment.findById(Number(id));
            if (!comment) {
                res.status(404).json({ message: 'Comentario no encontrado' });
                return;
            }
            // Verificar que el usuario sea el autor o admin
            if (loggedUser.role !== 'admin' && comment.user_id !== loggedUser.userId) {
                res.status(403).json({ message: 'No tienes permisos para editar este comentario' });
                return;
            }
            const updatedComment = await Comment_1.Comment.update(Number(id), content);
            res.json({ message: 'Comentario actualizado', comment: updatedComment });
            return;
        }
        catch (error) {
            console.error('Error en CommentController.update:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Elimina un comentario.
     * Permite la eliminación solo si el usuario es el autor o es administrador.
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const loggedUser = req.user;
            const comment = await Comment_1.Comment.findById(Number(id));
            if (!comment) {
                res.status(404).json({ message: 'Comentario no encontrado' });
                return;
            }
            if (loggedUser.role !== 'admin' && comment.user_id !== loggedUser.userId) {
                res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
                return;
            }
            const success = await Comment_1.Comment.delete(Number(id));
            if (!success) {
                res.status(404).json({ message: 'Comentario no encontrado para eliminar' });
                return;
            }
            res.json({ message: 'Comentario eliminado exitosamente' });
            return;
        }
        catch (error) {
            console.error('Error en CommentController.delete:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
}
exports.CommentController = CommentController;
