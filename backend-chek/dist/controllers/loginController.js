"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../db/db"));
const date_1 = __importDefault(require("../functions/date"));
// Función para iniciar sesión
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const datetime = (0, date_1.default)();
            // Consulta SQL para obtener los datos del usuario con un email determinado
            const [rows] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            // Si no encuentra al usuario, devuelve como respuesta el error de estado 401
            if (!Array.isArray(rows) || rows.length === 0) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }
            const user = rows[0];
            // Compara la clave de la base de datos con la clave ingresada por el usuario
            const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
            // Si las claves son distintas, inserta un registro de acceso con estado denegado
            if (!passwordMatch) {
                yield db_1.default.query('INSERT INTO logs (email, date_time, status) VALUES (?, ?, ?)', [email, datetime, 'Denegado']);
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            // Si las claves son correctas, inserta un registro de acceso con estado exitoso
            yield db_1.default.query('INSERT INTO logs (email, date_time, status) VALUES (?, ?, ?)', [email, datetime, 'Exitoso']);
            // Obtiene el historial de acceso de un email en especifico con su estado correspondiente
            const [logRows] = yield db_1.default.query('SELECT date_time, status FROM logs WHERE email = ? ORDER BY date_time DESC', [email]);
            // Convierte los datos obtenidos en un array de objetos
            function convertToRowDataPacketArray(data) {
                if (Array.isArray(data)) {
                    return data;
                }
                return [];
            }
            const rowDataPackets = convertToRowDataPacketArray(logRows);
            // Array de objetos con las llaves de fecha y estado
            const logsData = rowDataPackets.map((row) => ({
                date_time: row.date_time,
                status: row.status,
            }));
            // Crea un JSON Web Token con la información del usuario
            const token = jsonwebtoken_1.default.sign({ userId: user.id, firstname: user.firstname, logs: logsData }, 'desafio');
            res.json({ token });
        }
        catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Error during login' });
        }
    });
}
exports.login = login;
