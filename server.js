const express = require('express');
const authController = require('./controllers/auth.controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta base y de estado de salud
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de Gestión de Donaciones en funcionamiento.'
  });
});

// Rutas de autenticación
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Si se ejecuta directamente, iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor de donaciones corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
