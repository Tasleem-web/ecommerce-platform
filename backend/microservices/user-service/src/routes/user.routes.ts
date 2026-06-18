import { Router } from 'express';
import { requireAuth } from '../../../shared';
import { UserController } from '../controllers/user.controller';

export function userRouter(controller: UserController): Router {
  console.log('Setting up user routes...');
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', requireAuth, controller.me);
  router.get('/getUsers', controller.getUsers);
  return router;
}
