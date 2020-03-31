import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Olá' });
});

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);

export default routes;