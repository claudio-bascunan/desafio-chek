import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chektest8@gmail.com',
    pass: 'smynixgvrycxhyoz',
  },
});

export function sendMailRestore(destinatario: string, token: string) {
  const enlaceRestablecer = `http://desafio-chek-claudio-bascunan.s3-website.us-east-2.amazonaws.com/reset-password?token=${token}`;
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
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
}

export function sendMailVerification(destinatario: string, token: string) {
  const enlaceVerificacion = `http://desafio-chek-claudio-bascunan.s3-website.us-east-2.amazonaws.com/validate-register?token=${token}`;
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
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
}

export default transporter;