const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Controller Tests - Gestión de Donaciones', () => {
  beforeEach(() => {
    User.clear();
  });

  describe('POST /api/auth/register', () => {
    it('debe registrar un nuevo usuario/donante con éxito', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Juan Perez',
          email: 'juan@example.com',
          password: 'password123',
          role: 'donor'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('juan@example.com');
    });

    it('debe rechazar registro si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'juan@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debe evitar registro duplicado con el mismo correo', async () => {
      User.create({
        name: 'Maria Lopez',
        email: 'maria@example.com',
        password: 'password123',
        role: 'donor'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Maria Lopez',
          email: 'maria@example.com',
          password: 'newpassword'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(() => {
      User.create({
        name: 'Admin Donaciones',
        email: 'admin@donaciones.org',
        password: 'adminsecret123',
        role: 'admin'
      });
    });

    it('debe iniciar sesión con credenciales correctas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@donaciones.org',
          password: 'adminsecret123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.role).toBe('admin');
    });

    it('debe rechazar credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@donaciones.org',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
