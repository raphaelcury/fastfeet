import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import PartnerController from './app/controllers/PartnerController';

// Authentication Middleware
import Auth from './app/middlewares/Auth';

const routes = new Router();

// No auth routes
routes.post('/sessions', SessionController.store); // autenticação

// Auth routes
routes.use(Auth.verifyToken);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);

// Admin routes
routes.use(Auth.verifyAdminUser);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/partners', PartnerController.store);
routes.get('/partners', PartnerController.index);
routes.get('/partners/:id', PartnerController.show);
routes.put('/partners/:id', PartnerController.update);
routes.delete('/partners/:id', PartnerController.delete);

export default routes;
