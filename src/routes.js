import { Router } from 'express';

// Controllers
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';

// Middleware de autenticação
import Auth from './app/middlewares/Auth';

const routes = new Router();

// Rotas sem autenticação
routes.post('/sessions', SessionController.store); // autenticação

// A partir daqui o middleware de autenticação se aplica
routes.use(Auth.verifyToken);
routes.post('/recipients', RecipientController.store);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

export default routes;
