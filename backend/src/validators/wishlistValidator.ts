import { asObject, parseId } from "./common.js";

export function validateAddToWishlist(body: unknown): { variantId: number } {
  const data = asObject(body);
  return { variantId: parseId(data.variantId, "variantId") };
}
