import { api } from "./client";
import type { Product } from "./types";

export const productsKey = ["products"];

export const productKey = (id: number) => ["products", id];

export async function fetchProducts(): Promise<Product[]> {
  const { products } = await api<{ products: Product[] }>("/products");
  return products;
}

export async function fetchProduct(id: number): Promise<Product> {
  const { product } = await api<{ product: Product }>(`/products/${id}`);
  return product;
}
