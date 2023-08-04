import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/db';
import { sendMailRestore } from '../functions/mailer';

// Función para restablecer la clave
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    // Consulta SQL para obtener los datos del usuario a partir de un email determinado
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // Verifica si el usuario existe o no
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const token = jwt.sign({ email: email }, 'desafio', { expiresIn: '1h' });

    // Envia un correo con un enlace al usuario para que restablezca su clave
    sendMailRestore(email, token);

    res.json({ message: 'Correo enviado para restablecer contraseña' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
}