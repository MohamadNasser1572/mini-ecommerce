import { Router } from "express";
import type { CartController } from "../controllers/CartController.js";

export function cartRoutes(controller: CartController): Router {
  const router = Router();
  router.get("/", controller.get);
  router.post("/", controller.add);
  router.patch("/:itemId", controller.update);
  router.delete("/:itemId", controller.remove);
  return router;
}
