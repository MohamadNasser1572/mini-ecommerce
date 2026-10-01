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

export async function updateCartItem(itemId: number, data: { quantity?: number; variantId?: number }): Promise<Cart> {
  const { cart } = await api<{ cart: Cart }>(`/cart/${itemId}`, { method: "PATCH", body: data });
  return cart;
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const { cart } = await api<{ cart: Cart }>(`/cart/${itemId}`, { method: "DELETE" });
  return cart;
}
