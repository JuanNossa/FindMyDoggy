// src/infrastructure/database/dbConfig.ts

/**
 * Este archivo configura la conexión a la base de datos MySQL usando mysql2 con el patrón Singleton.
 * Se asegura de que exista una única instancia de pool de conexiones en toda la aplicación.
 */

import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env
dotenv.config();

class DBConfig {
  // Instancia privada para el pool de conexiones
  private static pool: Pool;

  // Constructor privado para evitar instanciación externa
  private constructor() {}

  /**
   * Retorna la instancia única del pool de conexiones.
   * Si aún no existe, la crea usando la configuración del archivo .env.
   */
  public static getPool(): Pool {
    if (!DBConfig.pool) {
      DBConfig.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'findmydoggy_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log('Pool de conexiones a MySQL creado.');
    }
    return DBConfig.pool;
  }
}

export default DBConfig;