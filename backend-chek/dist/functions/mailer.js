"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailVerification = exports.sendMailRestore = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'chektest8@gmail.com',
        pass: 'smynixgvrycxhyoz',
    },
});
function sendMailRestore(destinatario, token) {
    const enlaceRestablecer = `http://localhost:4200/reset-password?token=${token}`;
    const contenido = `
    ¡Hola!<br><br>
    Has solicitado restablecer la clave de tu cuenta Chek. Haz clic en el siguiente enlace para continuar:<br><br>
    <a href="${enlaceRestablecer}">Restablecer clave</a><br><br>
    Si no has solicitado este cambio, ignora este correo.<br><br>
    Saludos,<br>
    El equipo Chek <br>
    <br>
    <br>
    <br>
    Desafío Técnico Chek Agosto 2023 - Claudio Andrés Bascuñán Valdivia
  `;
    const mailOptions = {
        from: 'chektest8@gmail.com',
        to: destinatario,
        subject: 'Restablecer Clave Cuenta Chek',
        html: contenido,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        }
        else {
            console.log('Correo enviado:', info.response);
        }
    });
}
exports.sendMailRestore = sendMailRestore;
function sendMailVerification(destinatario, token) {
    const enlaceVerificacion = `http://localhost:4200/validate-register?token=${token}`;
    const contenido = `
    ¡Hola!<br><br>
    Gracias por registrarte en Chek. Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:<br><br>
    <a href="${enlaceVerificacion}">Verificar correo electrónico</a><br><br>
    Si no has solicitado este registro, ignora este correo.<br><br>
    Saludos,<br>
    El equipo Chek<br>
    <br>
    <br>
    <br>
    Desafío Técnico Chek Agosto 2023 - Claudio Andrés Bascuñán Valdivia
  `;
    const mailOptions = {
        from: 'chektest8@gmail.com',
        to: destinatario,
        subject: 'Verificación de Correo Electrónico Cuenta Chek',
        html: contenido,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        }
        else {
            console.log('Correo enviado:', info.response);
        }
    });
}
exports.sendMailVerification = sendMailVerification;
exports.default = transporter;
