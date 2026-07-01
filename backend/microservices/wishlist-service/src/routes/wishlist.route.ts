import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { requireAuth } from "../../../shared";

export function wishlistRouter(controller: WishlistController): Router {
  const router = Router();
  router.get('/', requireAuth, controller.list);
  router.post('/', requireAuth, controller.add);
  router.delete('/:productId', requireAuth, controller.remove);
  router.get('/:productId/check', requireAuth, controller.check);
  return router;
}