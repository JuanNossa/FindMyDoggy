"use strict";
// src/application/controllers/NotificationController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Notification_1 = require("../../domain/models/Notification");
// Configurar el transporter de nodemailer utilizando variables de entorno
// Asegúrate de definir en tu .env las siguientes variables:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER || 'usuario@example.com',
        pass: process.env.SMTP_PASS || 'password',
    },
});
class NotificationController {
    /**
     * Crea una nueva notificación y envía un correo al usuario.
     * Se espera en el body: user_id, email y message.
     */
    static async create(req, res) {
        try {
            const { user_id, email, message } = req.body;
            if (!user_id || !email || !message) {
                res.status(400).json({ message: 'Se requieren user_id, email y message' });
                return;
            }
            // Crear la notificación en la base de datos
            const notification = new Notification_1.Notification(user_id, message);
            const newNotification = await Notification_1.Notification.create(notification);
            // Enviar correo electrónico de notificación
            const mailOptions = {
                from: process.env.SMTP_USER || 'noreply@example.com',
                to: email,
                subject: 'Nueva Notificación en FindMyDoggy',
                text: message,
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error al enviar correo:', err);
                }
                else {
                    console.log('Correo enviado:', info.response);
                }
            });
            res.status(201).json({ message: 'Notificación creada y correo enviado', notification: newNotification });
            return;
        }
        catch (error) {
            console.error('Error en NotificationController.create:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
    /**
     * Retorna todas las notificaciones de un usuario.
     * Se espera que el ID del usuario se pase como parámetro en la URL.
     */
    static async getByUser(req, res) {
        try {
            const { user_id } = req.params;
            const notifications = await Notification_1.Notification.findByUserId(Number(user_id));
            res.json({ notifications });
            return;
        }
        catch (error) {
            console.error('Error en NotificationController.getByUser:', error);
            res.status(500).json({ error: error.message });
            return;
        }
    }
}
exports.NotificationController = NotificationController;
