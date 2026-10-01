import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env.js";
import { AUTH_COOKIE, getUserId } from "../middleware/requireAuth.js";
import type { AuthService } from "../services/AuthService.js";
import { validateLogin } from "../validators/authValidator.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.isProduction,
  path: "/",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = validateLogin(req.body);
    const { user, token } = await this.authService.login(email, password);
    res.cookie(AUTH_COOKIE, token, { ...cookieOptions, maxAge: SEVEN_DAYS_MS });
    res.json({ user });
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie(AUTH_COOKIE, cookieOptions);
    res.status(204).end();
  };

  me = async (req: Request, res: Response) => {
    const user = await this.authService.getUser(getUserId(req));
    res.json({ user });
  };
}
