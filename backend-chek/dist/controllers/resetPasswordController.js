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
exports.resetPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db/db"));
const mailer_1 = require("../functions/mailer");
// Función para restablecer la clave
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            // Consulta SQL para obtener los datos del usuario a partir de un email determinado
            const [rows] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            // Verifica si el usuario existe o no
            if (!Array.isArray(rows) || rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const user = rows[0];
            const token = jsonwebtoken_1.default.sign({ email: email }, 'desafio', { expiresIn: '1h' });
            // Envia un correo con un enlace al usuario para que restablezca su clave
            (0, mailer_1.sendMailRestore)(email, token);
            res.json({ message: 'Correo enviado para restablecer contraseña' });
        }
        catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            res.status(500).json({ message: 'Error al restablecer la contraseña' });
        }
    });
}
exports.resetPassword = resetPassword;
