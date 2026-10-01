import { api } from "./client";
import type { Order } from "./types";

export const orderKey = (id: number) => ["orders", id];

export async function placeOrder(): Promise<Order> {
  const { order } = await api<{ order: Order }>("/orders", { method: "POST" });
  return order;
}

export async function fetchOrder(id: number): Promise<Order> {
  const { order } = await api<{ order: Order }>(`/orders/${id}`);
  return order;
}
