import { api } from "./client";
import type { WishlistItem } from "./types";

export const wishlistKey = ["wishlist"];

export async function addToWishlist(variantId: number): Promise<WishlistItem[]> {
  const { items } = await api<{ items: WishlistItem[] }>("/wishlist", { method: "POST", body: { variantId } });
  return items;
}
