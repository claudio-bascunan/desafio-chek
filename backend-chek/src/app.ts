import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { resetPassword } from './controllers/resetPasswordController';
import { changePassword } from './controllers/changePasswordController';
import { register } from './controllers/registerController';
import { verifyEmail } from './controllers/verifyEmailController';
import { login } from './controllers/loginController';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Se definen los endpoints con sus respectivas funciones
app.post('/api/reset-password', resetPassword);
app.post('/api/change-password', changePassword);
app.post('/api/register', register);
app.get('/api/verify-email', verifyEmail);
app.post('/api/login', login);


const port = 3000;

// Se inicia el servidor en el puerto 3000
app.listen(port, () => {
    console.log('Servidor iniciado');
});

export default app;