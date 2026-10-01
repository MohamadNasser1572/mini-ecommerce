import { BadRequestError, NotFoundError, OutOfStockError } from "../errors/AppError.js";
import type { Transaction } from "../lib/prisma.js";
import type { CartRepository } from "../repositories/CartRepository.js";
import type { OrderRepository } from "../repositories/OrderRepository.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly transaction: Transaction,
  ) {}

  placeOrder(userId: number) {
    return this.transaction(async (tx) => {
      const cartItems = await this.cartRepository.findByUser(userId, tx);
      if (cartItems.length === 0) {
        throw new BadRequestError("Your cart is empty");
      }

      const items = cartItems
        .map(({ quantity, variant }) => ({
          variantId: variant.id,
          productTitle: variant.product.title,
          variantName: variant.name,
          unitPrice: variant.product.price,
          quantity,
        }))
        .sort((a, b) => a.variantId - b.variantId);

      for (const item of items) {
        const updated = await this.productRepository.decrementStock(item.variantId, item.quantity, tx);
        if (!updated) {
          throw new OutOfStockError(`Not enough stock for ${item.productTitle} (${item.variantName})`);
        }
      }

      const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const order = await this.orderRepository.create(userId, total, items, tx);
      await this.cartRepository.deleteByUser(userId, tx);
      return order;
    });
  }

  async getOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.findForUser(orderId, userId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    return order;
  }
}
