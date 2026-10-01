import { api } from "./client";
import type { Cart } from "./types";

export const cartKey = ["cart"];

export async function fetchCart(): Promise<Cart> {
  const { cart } = await api<{ cart: Cart }>("/cart");
  return cart;
}

export async function addToCart(variantId: number, quantity: number): Promise<Cart> {
  const { cart } = await api<{ cart: Cart }>("/cart", { method: "POST", body: { variantId, quantity } });
  return cart;
}
