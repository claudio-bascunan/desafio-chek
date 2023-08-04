import request from 'supertest';
import app from '../src/app';

// Prueba unitaria para el inicio de sesión
describe('POST /api/login', () => {
  it('Debe devolver estado 200 y un token debido al inicio de sesión exitoso', async () => {
    // Datos de prueba validos para la autenticación, debe ingresar
    const loginData = {
      email: 'claudio.bascunan@mail.udp.cl',
      password: '4444',
    };

    // Solicitud post al servidor
    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    // Asegura que el estado sea 200
    expect(response.status).toBe(200);

    // Confirma el token
    expect(response.body).toHaveProperty('token');
  });

  it('Debe devolver 401 si el correo electrónico o la contraseña son incorrectos', async () => {
    // Datos de prueba incorrectos para la autenticación
    const loginData = {
      email: 'correo@invalido.com',
      password: '5431',
    };

    // Solicitud post al servidor
    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    // Asegura que la respuesta tenga el estado 401
    expect(response.status).toBe(401);
  });
});