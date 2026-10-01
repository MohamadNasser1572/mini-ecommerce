import type { Prisma, PrismaClient } from "@prisma/client";
import type { Db } from "../lib/prisma.js";

const withProduct = {
  variant: { include: { product: { include: { variants: { orderBy: { id: "asc" } } } } } },
} as const;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{ include: typeof withProduct }>;

export class CartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByUser(userId: number, db: Db = this.prisma): Promise<CartItemWithProduct[]> {
    return db.cartItem.findMany({ where: { userId }, include: withProduct, orderBy: { id: "asc" } });
  }

  findById(id: number, db: Db = this.prisma) {
    return db.cartItem.findUnique({ where: { id }, include: { variant: true } });
  }

  findByUserAndVariant(userId: number, variantId: number, db: Db = this.prisma) {
    return db.cartItem.findUnique({ where: { userId_variantId: { userId, variantId } } });
  }

  upsert(userId: number, variantId: number, quantity: number, db: Db = this.prisma) {
    return db.cartItem.upsert({
      where: { userId_variantId: { userId, variantId } },
      create: { userId, variantId, quantity },
      update: { quantity },
    });
  }

  update(id: number, data: { variantId?: number; quantity?: number }, db: Db = this.prisma) {
    return db.cartItem.update({ where: { id }, data });
  }

  delete(id: number, db: Db = this.prisma) {
    return db.cartItem.delete({ where: { id } });
  }

  deleteByUser(userId: number, db: Db = this.prisma) {
    return db.cartItem.deleteMany({ where: { userId } });
  }
}
