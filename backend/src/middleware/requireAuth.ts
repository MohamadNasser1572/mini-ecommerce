import type { Request, RequestHandler } from "express";
import { UnauthorizedError } from "../errors/AppError.js";
import type { AuthService } from "../services/AuthService.js";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const AUTH_COOKIE = "token";

export function createRequireAuth(authService: AuthService): RequestHandler {
  return (req, _res, next) => {
    const token = req.cookies?.[AUTH_COOKIE];
    if (!token) {
      throw new UnauthorizedError();
    }
    req.userId = authService.verifyToken(token);
    next();
  };
}

export function getUserId(req: Request): number {
  if (req.userId === undefined) {
    throw new UnauthorizedError();
  }
  return req.userId;
}
