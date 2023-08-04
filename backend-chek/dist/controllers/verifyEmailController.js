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
exports.verifyEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db/db"));
// Función para validar correo electrónico luego de registrarse
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.query;
            jsonwebtoken_1.default.verify(token, 'desafio', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(401).json({ message: 'Token inválido o expirado' });
                }
                const { email } = decoded;
                // Consulta SQL para actualizar el estado de la cuenta a verificado, 0 no verificado y 1 verificado
                const query = 'UPDATE users SET verified = ? WHERE email = ?';
                yield db_1.default.query(query, [1, email]);
                res.json({ message: 'Correo electrónico verificado exitosamente' });
            }));
        }
        catch (error) {
            console.error('Error al verificar el correo electrónico:', error);
            res.status(500).json({ message: 'Error al verificar el correo electrónico' });
        }
    });
}
exports.verifyEmail = verifyEmail;
