import { BadRequestError } from "../errors/AppError.js";
import { asObject, parseId, parseQuantity } from "./common.js";

export function validateAddToCart(body: unknown): { variantId: number; quantity: number } {
  const data = asObject(body);
  return {
    variantId: parseId(data.variantId, "variantId"),
    quantity: data.quantity === undefined ? 1 : parseQuantity(data.quantity),
  };
}

export function validateUpdateCartItem(body: unknown): { variantId?: number; quantity?: number } {
  const data = asObject(body);
  if (data.variantId === undefined && data.quantity === undefined) {
    throw new BadRequestError("Provide a quantity or a variantId to update");
  }
  return {
    variantId: data.variantId === undefined ? undefined : parseId(data.variantId, "variantId"),
    quantity: data.quantity === undefined ? undefined : parseQuantity(data.quantity),
  };
}
