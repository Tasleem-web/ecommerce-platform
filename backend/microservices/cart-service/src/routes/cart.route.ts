import { Router } from "express";
import { requireAuth } from "../../../shared";
import { CartController } from "../controllers/cart.controller";

export function cartRouter(controller: CartController): Router {
  const router = Router();
  router.get('/', requireAuth, controller.list);
  router.post('/', requireAuth, controller.create);
  router.put('/:id', requireAuth, controller.update);
  router.delete('/:id', requireAuth, controller.remove);
  return router;
}