import { NotFoundError } from "../errors/AppError.js";
import type { Transaction } from "../lib/prisma.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";
import type { WishlistRepository } from "../repositories/WishlistRepository.js";
import type { CartService } from "./CartService.js";

export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartService: CartService,
    private readonly transaction: Transaction,
  ) {}

  list(userId: number) {
    return this.wishlistRepository.findByUser(userId);
  }

  async addItem(userId: number, variantId: number) {
    const variant = await this.productRepository.findVariant(variantId);
    if (!variant) {
      throw new NotFoundError("Product variant not found");
    }
    await this.wishlistRepository.upsert(userId, variant.productId, variant.id);
    return this.list(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.wishlistRepository.findById(itemId);
    if (!item || item.userId !== userId) {
      throw new NotFoundError("Wishlist item not found");
    }
    await this.wishlistRepository.delete(item.id);
    return this.list(userId);
  }

  async moveToCart(userId: number, itemId: number) {
    await this.transaction(async (tx) => {
      const item = await this.wishlistRepository.findById(itemId, tx);
      if (!item || item.userId !== userId) {
        throw new NotFoundError("Wishlist item not found");
      }
      await this.cartService.addToCart(tx, userId, item.variantId, 1);
      await this.wishlistRepository.delete(item.id, tx);
    });
    return this.list(userId);
  }
}
