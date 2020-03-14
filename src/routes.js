import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import SessionController from './app/controllers/SessionController';
import AvatarController from './app/controllers/AvatarController';
import RecipientController from './app/controllers/RecipientController';
import PartnerController from './app/controllers/PartnerController';
import DeliveryController from './app/controllers/DeliveryController';
import OpenDeliveryController from './app/controllers/OpenDeliveryController';
import ClosedDeliveryController from './app/controllers/ClosedDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

// Authentication Middleware
import Auth from './app/middlewares/Auth';

// Router component
const routes = new Router();

// Component for file upload
const uploadAvatar = multer(multerConfig.avatars);

// No auth routes
routes.post('/sessions', SessionController.store); // authentication

// Auth routes
routes.use(Auth.verifyToken);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.get('/partners/:partnerId/openDeliveries', OpenDeliveryController.index);
routes.get(
  '/partners/:partnerId/closedDeliveries',
  ClosedDeliveryController.index
);
routes.put(
  '/partners/:partnerId/openDeliveries/:deliveryId/start',
  OpenDeliveryController.update
);
routes.put(
  '/partners/:partnerId/openDeliveries/:deliveryId/end',
  ClosedDeliveryController.update
);
routes.post(
  '/deliveries/:deliveryId/problems',
  DeliveryProblemController.store
);

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
routes.delete('/problems/:problemId/cancelDelivery', DeliveryController.delete);

routes.get('/deliveries/:deliveryId/problems', DeliveryProblemController.index);

// Upload route for partner avatars
routes.post(
  '/partners/:partnerId/files/avatars',
  uploadAvatar.single('file'),
  AvatarController.store
);

export default routes;
