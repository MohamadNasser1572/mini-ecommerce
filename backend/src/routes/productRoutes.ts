import { Router } from "express";
import type { ProductController } from "../controllers/ProductController.js";

export function productRoutes(controller: ProductController): Router {
  const router = Router();
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  return router;
}
