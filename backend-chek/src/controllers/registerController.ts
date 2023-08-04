import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../db/db';
import { sendMailVerification } from '../functions/mailer';

// Función para registrar un nuevo usuario
export async function register(req: Request, res: Response) {
  try {
    const { firstname, lastname, email, password, birthdate } = req.body;

    // Obtiene los datos del usuario a partir de un email determinado
    const [rowEmail] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // Verifica si el correo electrónico ya está registrado
    if (!Array.isArray(rowEmail) || rowEmail.length > 0) {
      return res.status(400).json({ message: 'El correo eléctronico ingresado ya está registrado' });
    }

    // Encriptar la clave
    const hashedPassword = await bcrypt.hash(password, 10);

    // Consulta SQL para insertar los datos del nuevo usuario
    const query = 'INSERT INTO users (firstname, lastname, email, password, birthdate, verified) VALUES (?, ?, ?, ?, ?, ?)';
    const token = jwt.sign({ email }, 'desafio', { expiresIn: '1h' });
    await pool.query(query, [firstname, lastname, email, hashedPassword, birthdate, 0]);

    // Envia correo para que usuario valide su correo electrónico
    sendMailVerification(email, token);

    res.status(201).json({ message: 'Usuario registrado exitosamente. Verifica tu correo electrónico.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
}