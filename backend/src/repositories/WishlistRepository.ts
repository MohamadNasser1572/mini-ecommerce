import type { PrismaClient } from "@prisma/client";
import type { Db } from "../lib/prisma.js";

export class WishlistRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByUser(userId: number) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true, variant: true },
      orderBy: { id: "asc" },
    });
  }

  findById(id: number, db: Db = this.prisma) {
    return db.wishlistItem.findUnique({ where: { id } });
  }

  upsert(userId: number, productId: number, variantId: number) {
    return this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, variantId },
      update: { variantId },
    });
  }

  delete(id: number, db: Db = this.prisma) {
    return db.wishlistItem.delete({ where: { id } });
  }
}
