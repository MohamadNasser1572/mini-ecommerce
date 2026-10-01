import { Router } from "express";
import type { WishlistController } from "../controllers/WishlistController.js";

export function wishlistRoutes(controller: WishlistController): Router {
  const router = Router();
  router.get("/", controller.list);
  router.post("/", controller.add);
  router.delete("/:itemId", controller.remove);
  router.post("/:itemId/move-to-cart", controller.moveToCart);
  return router;
}
