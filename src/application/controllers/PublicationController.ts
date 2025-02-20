// src/application/controllers/PublicationController.ts

import { Request, Response } from 'express';
import { Publication } from '../../domain/models/Publication';

export class PublicationController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, reward, user_id } = req.body;
      // Los campos opcionales se procesan de la siguiente manera:
      const location_id = req.body.location_id ? Number(req.body.location_id) : undefined;
      const latitude = req.body.latitude ? Number(req.body.latitude) : undefined;
      const longitude = req.body.longitude ? Number(req.body.longitude) : undefined;
      const image_path = req.file ? req.file.filename : undefined;

      const publication = new Publication(
        title,
        description,
        reward,
        Number(user_id),
        location_id,
        image_path,
        latitude,
        longitude
      );
      const newPublication = await Publication.create(publication);
      res.status(201).json({ message: 'Publicación creada exitosamente', publication: newPublication });
    } catch (error: any) {
      console.error('Error en PublicationController.create:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const publications = await Publication.findAll();
      res.json({ publications });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const publication = await Publication.findById(Number(id));
      if (!publication) {
        res.status(404).json({ message: 'Publicación no encontrada' });
        return;
      }
      res.json({ publication });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Procesar campos opcionales para evitar valores null
      const data: Partial<Publication> = {
        title: req.body.title,
        description: req.body.description,
        reward: req.body.reward,
        location_id: req.body.location_id ? Number(req.body.location_id) : undefined,
        latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
        longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
        image_path: req.file ? req.file.filename : undefined
      };

      const updatedPublication = await Publication.update(Number(id), data);
      if (!updatedPublication) {
        res.status(404).json({ message: 'Publicación no encontrada para actualizar' });
        return;
      }
      res.json({ message: 'Publicación actualizada', publication: updatedPublication });
    } catch (error: any) {
      console.error('Error en PublicationController.update:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await Publication.delete(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Publicación no encontrada para eliminar' });
        return;
      }
      res.json({ message: 'Publicación eliminada correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}