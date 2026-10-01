import type { Prisma } from "@prisma/client";
import { BadRequestError, NotFoundError, OutOfStockError } from "../errors/AppError.js";
import type { Transaction } from "../lib/prisma.js";
import type { CartItemWithProduct, CartRepository } from "../repositories/CartRepository.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly transaction: Transaction,
  ) {}

  async getCart(userId: number) {
    const items = await this.cartRepository.findByUser(userId);
    return this.toCart(items);
  }

  async addItem(userId: number, variantId: number, quantity: number) {
    await this.transaction((tx) => this.addToCart(tx, userId, variantId, quantity));
    return this.getCart(userId);
  }

  async addToCart(tx: Prisma.TransactionClient, userId: number, variantId: number, quantity: number) {
    const variant = await this.productRepository.findVariant(variantId, tx);
    if (!variant) {
      throw new NotFoundError("Product variant not found");
    }
    const existing = await this.cartRepository.findByUserAndVariant(userId, variantId, tx);
    const total = (existing?.quantity ?? 0) + quantity;
    this.assertInStock(variant.stock, total);
    await this.cartRepository.upsert(userId, variantId, total, tx);
  }

  async updateItem(userId: number, itemId: number, input: { variantId?: number; quantity?: number }) {
    await this.transaction(async (tx) => {
      const item = await this.cartRepository.findById(itemId, tx);
      if (!item || item.userId !== userId) {
        throw new NotFoundError("Cart item not found");
      }
      const quantity = input.quantity ?? item.quantity;

      if (input.variantId === undefined || input.variantId === item.variantId) {
        this.assertInStock(item.variant.stock, quantity);
        await this.cartRepository.update(item.id, { quantity }, tx);
        return;
      }

      const variant = await this.productRepository.findVariant(input.variantId, tx);
      if (!variant || variant.productId !== item.variant.productId) {
        throw new BadRequestError("This variant does not belong to the product");
      }

      const existing = await this.cartRepository.findByUserAndVariant(userId, variant.id, tx);
      if (!existing) {
        this.assertInStock(variant.stock, quantity);
        await this.cartRepository.update(item.id, { variantId: variant.id, quantity }, tx);
        return;
      }

      const merged = existing.quantity + quantity;
      this.assertInStock(variant.stock, merged);
      const steps = [
        { id: existing.id, run: () => this.cartRepository.update(existing.id, { quantity: merged }, tx) },
        { id: item.id, run: () => this.cartRepository.delete(item.id, tx) },
      ].sort((a, b) => a.id - b.id);
      for (const step of steps) {
        await step.run();
      }
    });
    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.cartRepository.findById(itemId);
    if (!item || item.userId !== userId) {
      throw new NotFoundError("Cart item not found");
    }
    await this.cartRepository.delete(item.id);
    return this.getCart(userId);
  }

  private assertInStock(stock: number, quantity: number) {
    if (stock === 0) {
      throw new OutOfStockError("This item is out of stock");
    }
    if (quantity > stock) {
      throw new OutOfStockError(`Only ${stock} left in stock`);
    }
  }

  private toCart(items: CartItemWithProduct[]) {
    const lines = items.map(({ id, quantity, variant }) => ({
      id,
      quantity,
      subtotal: variant.product.price * quantity,
      variant: { id: variant.id, name: variant.name, stock: variant.stock },
      product: {
        id: variant.product.id,
        title: variant.product.title,
        price: variant.product.price,
        imageUrl: variant.product.imageUrl,
        variants: variant.product.variants.map((v) => ({ id: v.id, name: v.name, stock: v.stock })),
      },
    }));
    return { items: lines, total: lines.reduce((sum, line) => sum + line.subtotal, 0) };
  }
}
