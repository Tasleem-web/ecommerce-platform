import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireSessionAuth, requireAdminSession } from '../middleware/session-auth';

export function userRouter(controller: UserController): Router {
  console.log('Setting up user routes...');
  const router = Router();
  router.get('/', requireSessionAuth, controller.getUsers);
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.post('/logout', controller.logout);
  router.post('/upload-buffer', controller.uploadBuffer);
  router.post('/upload-url', controller.uploadUrl);
  router.get('/me', requireSessionAuth, controller.me);
  router.get('/admin/analytics', requireSessionAuth, requireAdminSession, controller.getAdminAnalytics);
  return router;
}
