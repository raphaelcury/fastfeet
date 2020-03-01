import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import PartnerController from './app/controllers/PartnerController';
import DeliveryController from './app/controllers/DeliveryController';

// Authentication Middleware
import Auth from './app/middlewares/Auth';

const routes = new Router();

// No auth routes
routes.post('/sessions', SessionController.store); // authentication

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
routes.put('/partners/:id', PartnerController.update);
routes.delete('/partners/:id', PartnerController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryController.update);
routes.put('/deliveries/:id/start', DeliveryController.start);
routes.put('/deliveries/:id/end', DeliveryController.end);
routes.delete('/deliveries/:id', DeliveryController.delete);

export default routes;
