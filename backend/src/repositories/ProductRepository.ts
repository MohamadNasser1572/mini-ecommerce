import type { PrismaClient } from "@prisma/client";
import type { Db } from "../lib/prisma.js";

const withVariants = { variants: { orderBy: { id: "asc" } } } as const;

export class ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAll() {
    return this.prisma.product.findMany({ include: withVariants, orderBy: { id: "asc" } });
  }

  findById(id: number) {
    return this.prisma.product.findUnique({ where: { id }, include: withVariants });
  }

  findVariant(id: number, db: Db = this.prisma) {
    return db.productVariant.findUnique({ where: { id } });
  }

  async decrementStock(variantId: number, quantity: number, db: Db): Promise<boolean> {
    const { count } = await db.productVariant.updateMany({
      where: { id: variantId, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });
    return count === 1;
  }
}
