import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../db/db';

// Función para cambiar la clave de la cuenta Chek
export async function changePassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    // Verifica el token recibido usando la key 'desafio'
    jwt.verify(token, 'desafio', async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      // Obtiene el correo eléctronico mediante la decodificación
      const { email } = decoded as { email: string };

      // Encriptación de la clave
      const hashedPassword = await bcrypt.hash(password, 10);

      // Consulta SQL que actualiza la clave
      const query = 'UPDATE users SET password = ? WHERE email = ?';
      await pool.query(query, [hashedPassword, email]);

      res.json({ message: 'Contraseña actualizada exitosamente' });
    });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
}