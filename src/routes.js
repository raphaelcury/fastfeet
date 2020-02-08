import { Router } from 'express';

// Controllers

// Middleware de autenticação

const routes = new Router();

// Rotas sem autenticacao
routes.get('/recipients', (req, res) => {
  return res.json({ msg: 'OK' });
});

// A partir daqui o middleware de autenticação se aplica

export default routes;
