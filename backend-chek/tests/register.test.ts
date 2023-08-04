import request from 'supertest';
import app from '../src/app';

// Prueba unitaria para el registro de un usuario
describe('POST /api/register', () => {
  it('Debe registrar un nuevo usuario y enviar un correo electrónico para validar la cuenta', async () => {
    // Datos de prueba para el registro, no debe haber un correo igual
    const newUser = {
      firstname: 'Test',
      lastname: 'Chek',
      email: 'testchek8@gmail.com',
      password: '4444',
      birthdate: '1990-01-01',
    };

    // Solicitud post al servidor
    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    // Asegura que el estado sea 201
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente. Verifica tu correo electrónico.');
  });

  it('Debe devolver 400 si el correo electrónico ya está registrado', async () => {
    // Datos ya un usuario ya registrado
    const existingUser = {
        firstname: 'Claudio',
        lastname: 'Bascunan',
        email: 'claudio.bascunan@mail.udp.cl',
        password: '4444',
        birthdate: '2000-02-21',
      };
    
    // Realiza una solicitud post, luego realiza otra para obtener el estado  
    await request(app)
      .post('/api/register')
      .send(existingUser);

    const response = await request(app)
      .post('/api/register')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'El correo eléctronico ingresado ya está registrado');
  });
});