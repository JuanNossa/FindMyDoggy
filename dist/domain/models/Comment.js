"use strict";
// src/domain/models/Comment.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
/**
 * Modelo para los comentarios en publicaciones.
 * Representa la estructura de la tabla 'comments' en la base de datos.
 * Se proveen métodos estáticos para crear, buscar, actualizar y eliminar comentarios
 * mediante consultas directas con mysql2.
 */
const dbConfig_1 = __importDefault(require("../../infrastructure/database/dbConfig"));
class Comment {
    /**
     * Constructor para crear una instancia de Comment.
     * @param publication_id ID de la publicación a la que pertenece el comentario.
     * @param user_id ID del usuario que realiza el comentario.
     * @param content Contenido del comentario.
     */
    constructor(publication_id, user_id, content) {
        this.publication_id = publication_id;
        this.user_id = user_id;
        this.content = content;
    }
    /**
     * Inserta un nuevo comentario en la base de datos.
     * @param comment Instancia de Comment a insertar.
     * @returns La instancia del comentario con su ID asignado.
     */
    static async create(comment) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('INSERT INTO comments (publication_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())', [comment.publication_id, comment.user_id, comment.content]);
        comment.id = result.insertId;
        return comment;
    }
    /**
     * Busca un comentario por su ID.
     * @param id ID del comentario a buscar.
     * @returns La instancia de Comment si se encuentra, o null en caso contrario.
     */
    static async findById(id) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
        const results = rows;
        if (results.length > 0) {
            const row = results[0];
            const comment = new Comment(row.publication_id, row.user_id, row.content);
            comment.id = row.id;
            comment.created_at = row.created_at;
            return comment;
        }
        return null;
    }
    /**
     * Retorna todos los comentarios asociados a una publicación.
     * @param publication_id ID de la publicación.
     * @returns Un array de comentarios.
     */
    static async findByPublicationId(publication_id) {
        const pool = dbConfig_1.default.getPool();
        const [rows] = await pool.query('SELECT * FROM comments WHERE publication_id = ?', [publication_id]);
        return rows;
    }
    /**
     * Actualiza el contenido de un comentario.
     * @param id ID del comentario a actualizar.
     * @param content Nuevo contenido del comentario.
     * @returns La instancia actualizada del comentario, o null si no se encontró.
     */
    static async update(id, content) {
        const pool = dbConfig_1.default.getPool();
        await pool.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
        return Comment.findById(id);
    }
    /**
     * Elimina un comentario por su ID.
     * @param id ID del comentario a eliminar.
     * @returns True si la eliminación fue exitosa, false en caso contrario.
     */
    static async delete(id) {
        const pool = dbConfig_1.default.getPool();
        const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.Comment = Comment;
