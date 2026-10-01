import { NotFoundError } from "../errors/AppError.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list() {
    return this.productRepository.findAll();
  }

  async getById(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }
}
