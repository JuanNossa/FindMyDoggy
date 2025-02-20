// src/application/controllers/PublicationController.ts

/**
 * Controlador para las publicaciones.
 * Proporciona métodos para crear, listar, obtener, actualizar y eliminar publicaciones.
 */

import { Request, Response } from 'express';
import { Publication } from '../../domain/models/Publication';

export class PublicationController {
  /**
   * Crea una nueva publicación.
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, reward, user_id, location_id } = req.body;
      const publication = new Publication(title, description, reward, user_id, location_id);
      const newPublication = await Publication.create(publication);
      res.status(201).json({ message: 'Publicación creada exitosamente', publication: newPublication });
      return;
    } catch (error: any) {
      console.error('Error en PublicationController.create:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Retorna todas las publicaciones.
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const publications = await Publication.findAll();
      res.json({ publications });
      return;
    } catch (error: any) {
      console.error('Error en PublicationController.getAll:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Retorna una publicación por su ID.
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const publication = await Publication.findById(Number(id));
      if (!publication) {
        res.status(404).json({ message: 'Publicación no encontrada' });
        return;
      }
      res.json({ publication });
      return;
    } catch (error: any) {
      console.error('Error en PublicationController.getById:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Actualiza una publicación.
   * Permite la modificación solo si el usuario es el autor o es administrador.
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const loggedUser = (req as any).user; // Inyectado por el middleware JWT
      const publication = await Publication.findById(Number(id));
      if (!publication) {
        res.status(404).json({ message: 'Publicación no encontrada' });
        return;
      }
      // Verifica que el usuario sea el autor o admin
      if (loggedUser.role !== 'admin' && publication.user_id !== loggedUser.userId) {
        res.status(403).json({ message: 'No tienes permisos para editar esta publicación' });
        return;
      }
      const updatedPublication = await Publication.update(Number(id), req.body);
      res.json({ message: 'Publicación actualizada', publication: updatedPublication });
      return;
    } catch (error: any) {
      console.error('Error en PublicationController.update:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Elimina una publicación.
   * Permite la eliminación solo si el usuario es el autor o es administrador.
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const loggedUser = (req as any).user;
      const publication = await Publication.findById(Number(id));
      if (!publication) {
        res.status(404).json({ message: 'Publicación no encontrada' });
        return;
      }
      // Verifica que el usuario sea el autor o admin
      if (loggedUser.role !== 'admin' && publication.user_id !== loggedUser.userId) {
        res.status(403).json({ message: 'No tienes permisos para eliminar esta publicación' });
        return;
      }
      const success = await Publication.delete(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Publicación no encontrada para eliminar' });
        return;
      }
      res.json({ message: 'Publicación eliminada correctamente' });
      return;
    } catch (error: any) {
      console.error('Error en PublicationController.delete:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }
}