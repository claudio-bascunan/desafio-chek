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
exports.changePassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../db/db"));
// Función para cambiar la clave de la cuenta Chek
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, password } = req.body;
            // Verifica el token recibido usando la key 'desafio'
            jsonwebtoken_1.default.verify(token, 'desafio', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(401).json({ message: 'Token inválido o expirado' });
                }
                // Obtiene el correo eléctronico mediante la decodificación
                const { email } = decoded;
                // Encriptación de la clave
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                // Consulta SQL que actualiza la clave
                const query = 'UPDATE users SET password = ? WHERE email = ?';
                yield db_1.default.query(query, [hashedPassword, email]);
                res.json({ message: 'Contraseña actualizada exitosamente' });
            }));
        }
        catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            res.status(500).json({ message: 'Error al cambiar la contraseña' });
        }
    });
}
exports.changePassword = changePassword;
