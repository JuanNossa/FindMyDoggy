// src/application/controllers/CommentController.ts

/**
 * Controlador para el módulo de comentarios en publicaciones.
 * Proporciona métodos para crear, consultar, actualizar y eliminar comentarios.
 * Se asume que la validación de que el usuario es el autor (o admin en el caso de eliminar) se hará a nivel de lógica de negocio o mediante middleware.
 */

import { Request, Response } from 'express';
import { Comment } from '../../domain/models/Comment';

export class CommentController {
  /**
   * Crea un nuevo comentario para una publicación.
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { publication_id, user_id, content } = req.body;
      if (!publication_id || !user_id || !content) {
        res.status(400).json({ message: 'Se requieren publication_id, user_id y content' });
        return;
      }
      const comment = new Comment(publication_id, user_id, content);
      const newComment = await Comment.create(comment);
      res.status(201).json({ message: 'Comentario creado exitosamente', comment: newComment });
      return;
    } catch (error: any) {
      console.error('Error en CommentController.create:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Retorna todos los comentarios de una publicación.
   */
  static async getByPublication(req: Request, res: Response): Promise<void> {
    try {
      const pubId = Number(req.params.pubId);
      const comments = await Comment.findByPublicationId(pubId);
      res.json({ comments });
      return;
    } catch (error: any) {
      console.error('Error en CommentController.getByPublication:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Actualiza el contenido de un comentario.
   * Permite la edición solo si el usuario es el autor o es administrador.
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const loggedUser = (req as any).user;
      const { content } = req.body;
      if (!content) {
        res.status(400).json({ message: 'Se requiere el nuevo contenido' });
        return;
      }
      const comment = await Comment.findById(Number(id));
      if (!comment) {
        res.status(404).json({ message: 'Comentario no encontrado' });
        return;
      }
      // Verificar que el usuario sea el autor o admin
      if (loggedUser.role !== 'admin' && comment.user_id !== loggedUser.userId) {
        res.status(403).json({ message: 'No tienes permisos para editar este comentario' });
        return;
      }
      const updatedComment = await Comment.update(Number(id), content);
      res.json({ message: 'Comentario actualizado', comment: updatedComment });
      return;
    } catch (error: any) {
      console.error('Error en CommentController.update:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Elimina un comentario.
   * Permite la eliminación solo si el usuario es el autor o es administrador.
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const loggedUser = (req as any).user;
      const comment = await Comment.findById(Number(id));
      if (!comment) {
        res.status(404).json({ message: 'Comentario no encontrado' });
        return;
      }
      if (loggedUser.role !== 'admin' && comment.user_id !== loggedUser.userId) {
        res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
        return;
      }
      const success = await Comment.delete(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Comentario no encontrado para eliminar' });
        return;
      }
      res.json({ message: 'Comentario eliminado exitosamente' });
      return;
    } catch (error: any) {
      console.error('Error en CommentController.delete:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }
}