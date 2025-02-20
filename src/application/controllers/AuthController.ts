// src/application/controllers/AuthController.ts

/**
 * Controlador de autenticación.
 * Proporciona métodos para registrar y autenticar usuarios utilizando JWT.
 */

import { Request, Response } from 'express';
import { User } from '../../domain/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
  /**
   * Registra un nuevo usuario.
   * Recibe en el body: name, email, password.
   * Retorna void luego de enviar la respuesta.
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      
      // Verificar si el usuario ya existe.
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'El usuario ya existe' });
        return;
      }
      
      // Hashear la contraseña antes de guardarla.
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear la instancia del usuario.
      const user = new User(name, email, hashedPassword);
      
      // Insertar el usuario en la base de datos.
      const newUser = await User.create(user);
      
      // Enviar respuesta de éxito.
      res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
      return;
    } catch (error: any) {
      console.error('Error en register:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }

  /**
   * Autentica un usuario y genera un token JWT.
   * Recibe en el body: email, password.
   * Retorna void luego de enviar la respuesta.
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Buscar el usuario por email.
      const user = await User.findByEmail(email);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      // Comparar la contraseña proporcionada con la almacenada.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Contraseña incorrecta' });
        return;
      }
      
      // Generar el token JWT.
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secretKey',
        { expiresIn: '1h' }
      );
      
      // Enviar respuesta con el token.
      res.json({ message: 'Inicio de sesión exitoso', token });
      return;
    } catch (error: any) {
      console.error('Error en login:', error);
      res.status(500).json({ error: error.message });
      return;
    }
  }
}
