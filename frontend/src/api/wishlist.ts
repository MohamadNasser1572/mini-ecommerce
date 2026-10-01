import { api } from "./client";
import type { WishlistItem } from "./types";

export const wishlistKey = ["wishlist"];

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const { items } = await api<{ items: WishlistItem[] }>("/wishlist");
  return items;
}

export async function addToWishlist(variantId: number): Promise<WishlistItem[]> {
  const { items } = await api<{ items: WishlistItem[] }>("/wishlist", { method: "POST", body: { variantId } });
  return items;
}

export async function removeFromWishlist(itemId: number): Promise<WishlistItem[]> {
  const { items } = await api<{ items: WishlistItem[] }>(`/wishlist/${itemId}`, { method: "DELETE" });
  return items;
}

export async function moveToCart(itemId: number): Promise<WishlistItem[]> {
  const { items } = await api<{ items: WishlistItem[] }>(`/wishlist/${itemId}/move-to-cart`, { method: "POST" });
  return items;
}
