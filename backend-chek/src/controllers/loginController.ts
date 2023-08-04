import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool, { RowDataPacket } from '../db/db';
import getDatetime from '../functions/date';

// Función para iniciar sesión
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const datetime = getDatetime();

    // Consulta SQL para obtener los datos del usuario con un email determinado
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // Si no encuentra al usuario, devuelve como respuesta el error de estado 401
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0] as RowDataPacket;

    // Compara la clave de la base de datos con la clave ingresada por el usuario
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Si las claves son distintas, inserta un registro de acceso con estado denegado
    if (!passwordMatch) {
      await pool.query('INSERT INTO logs (email, date_time, status) VALUES (?, ?, ?)', [email, datetime, 'Denegado']);
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si las claves son correctas, inserta un registro de acceso con estado exitoso
    await pool.query('INSERT INTO logs (email, date_time, status) VALUES (?, ?, ?)', [email, datetime, 'Exitoso']);

    // Obtiene el historial de acceso de un email en especifico con su estado correspondiente
    const [logRows] = await pool.query('SELECT date_time, status FROM logs WHERE email = ? ORDER BY date_time DESC', [email]);

    // Convierte los datos obtenidos en un array de objetos
    function convertToRowDataPacketArray(data: any): RowDataPacket[] {
      if (Array.isArray(data)) {
        return data as RowDataPacket[];
      }
      return [];
    }

    const rowDataPackets = convertToRowDataPacketArray(logRows);

    // Array de objetos con las llaves de fecha y estado
    const logsData = rowDataPackets.map((row: RowDataPacket) => ({
      date_time: row.date_time,
      status: row.status,
    }));

    // Crea un JSON Web Token con la información del usuario
    const token = jwt.sign({ userId: user.id, firstname: user.firstname, logs: logsData }, 'desafio');

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
}