import { Router } from 'express';
import { requireAuth, requireRole } from '../../../shared';
import { ProductController } from '../controllers/product.controller';

export function productRouter(controller: ProductController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', requireAuth, requireRole('admin'), controller.create);
  router.put('/:id', requireAuth, requireRole('admin'), controller.update);
  router.delete('/:id', requireAuth, requireRole('admin'), controller.remove);
  return router;
}
