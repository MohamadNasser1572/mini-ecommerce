import { Router } from "express";
import type { OrderController } from "../controllers/OrderController.js";

export function orderRoutes(controller: OrderController): Router {
  const router = Router();
  router.post("/", controller.place);
  router.get("/:id", controller.getById);
  return router;
}
