import { Router } from 'express';

// Controllers

// Middleware de autenticação

const routes = new Router();

// Rotas sem autenticacao
routes.get('/test', (req, res) => {
  return res.json({ msg: 'OK' });
});
routes.post('/sessions', (req, res) => {
  return res.json({ msg: 'NEW SESSION OK' });
});

// A partir daqui o middleware de autenticação se aplica
routes.get('/recipients', (req, res) => {
  return res.json({ msg: 'RECIPIENTS OK' });
});

export default routes;
