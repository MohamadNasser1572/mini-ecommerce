import { Router, type RequestHandler } from "express";
import type { AuthController } from "../controllers/AuthController.js";

export function authRoutes(controller: AuthController, requireAuth: RequestHandler): Router {
  const router = Router();
  router.post("/login", controller.login);
  router.post("/logout", controller.logout);
  router.get("/me", requireAuth, controller.me);
  return router;
}
