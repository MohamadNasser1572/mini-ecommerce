import { BadRequestError } from "../errors/AppError.js";
import { asObject } from "./common.js";

export function validateLogin(body: unknown): { email: string; password: string } {
  const data = asObject(body);
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestError("A valid email is required");
  }
  if (!password) {
    throw new BadRequestError("Password is required");
  }
  return { email, password };
}
