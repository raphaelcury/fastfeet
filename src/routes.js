import { Router } from 'express';

// Controllers
import RecipientController from './app/controllers/RecipientController';

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
routes.post('/recipients', RecipientController.store);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

export default routes;
