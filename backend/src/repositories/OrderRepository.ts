import type { PrismaClient } from "@prisma/client";
import type { Db } from "../lib/prisma.js";

export type NewOrderItem = {
  variantId: number;
  productTitle: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
};

export class OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(userId: number, total: number, items: NewOrderItem[], db: Db = this.prisma) {
    return db.order.create({
      data: { userId, total, items: { create: items } },
      include: { items: { orderBy: { id: "asc" } } },
    });
  }

  findForUser(id: number, userId: number) {
    return this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { orderBy: { id: "asc" } } },
    });
  }
}
