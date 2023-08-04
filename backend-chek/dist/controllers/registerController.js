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
exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../db/db"));
const mailer_1 = require("../functions/mailer");
// Función para registrar un nuevo usuario
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstname, lastname, email, password, birthdate } = req.body;
            // Obtiene los datos del usuario a partir de un email determinado
            const [rowEmail] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            // Verifica si el correo electrónico ya está registrado
            if (!Array.isArray(rowEmail) || rowEmail.length > 0) {
                return res.status(400).json({ message: 'El correo eléctronico ingresado ya está registrado' });
            }
            // Encriptar la clave
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // Consulta SQL para insertar los datos del nuevo usuario
            const query = 'INSERT INTO users (firstname, lastname, email, password, birthdate, verified) VALUES (?, ?, ?, ?, ?, ?)';
            const token = jsonwebtoken_1.default.sign({ email }, 'desafio', { expiresIn: '1h' });
            yield db_1.default.query(query, [firstname, lastname, email, hashedPassword, birthdate, 0]);
            // Envia correo para que usuario valide su correo electrónico
            (0, mailer_1.sendMailVerification)(email, token);
            res.status(201).json({ message: 'Usuario registrado exitosamente. Verifica tu correo electrónico.' });
        }
        catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ message: 'Error al registrar usuario' });
        }
    });
}
exports.register = register;
