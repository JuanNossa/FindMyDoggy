import { Router, Request, Response } from 'express';
import DBConfig from '../database/dbConfig';

const router = Router();

/**
 * Ruta para probar la conexión a la base de datos.
 */
router.get('/test-connection', async (_req: Request, res: Response) => {
  try {
    const pool = DBConfig.getPool();
    const connection = await pool.getConnection();
    await connection.ping(); // Verifica la conexión
    connection.release(); // Libera la conexión después de la prueba

    res.status(200).json({ success: true, message: 'Conexión exitosa a la base de datos.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al conectar con la base de datos.', error });
  }
});

export default router;