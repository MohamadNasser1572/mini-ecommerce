import { BadRequestError } from "../errors/AppError.js";

const MAX_QUANTITY = 99;

export function asObject(body: unknown): Record<string, unknown> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new BadRequestError("Request body must be a JSON object");
  }
  return body as Record<string, unknown>;
}

export function parseId(value: unknown, name = "id"): number {
  const id = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
    throw new BadRequestError(`${name} must be a positive integer`);
  }
  return id;
}

export function parseQuantity(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > MAX_QUANTITY) {
    throw new BadRequestError(`quantity must be a whole number between 1 and ${MAX_QUANTITY}`);
  }
  return value;
}
