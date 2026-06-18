import { Router } from 'express';
import { requireAuth } from '../../../shared';
import { UserController } from '../controllers/user.controller';

export function userRouter(controller: UserController): Router {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', requireAuth, controller.me);
  router.get('/', requireAuth, controller.users);
  return router;
}
