import { Router } from 'express';

// Controllers

// Middleware de autenticação

const routes = new Router();

// Rotas sem autenticacao
routes.post('/sessions', (req, res) => {
  return res.json({ msg: 'NEW SESSION OK' });
});

routes.get('/test', (req, res) => {
  return res.json({ msg: 'OK' });
});

// A partir daqui o middleware de autenticação se aplica

export default routes;
