import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/db';

// Función para validar correo electrónico luego de registrarse
export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;

    jwt.verify(token as string, 'desafio', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      const { email } = decoded as { email: string };

      // Consulta SQL para actualizar el estado de la cuenta a verificado, 0 no verificado y 1 verificado
      const query = 'UPDATE users SET verified = ? WHERE email = ?';
      await pool.query(query, [1, email]);

      res.json({ message: 'Correo electrónico verificado exitosamente' });
    });
  } catch (error) {
    console.error('Error al verificar el correo electrónico:', error);
    res.status(500).json({ message: 'Error al verificar el correo electrónico' });
  }
}