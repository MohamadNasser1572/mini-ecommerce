import type { Request, Response } from "express";
import type { ProductService } from "../services/ProductService.js";
import { parseId } from "../validators/common.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  list = async (_req: Request, res: Response) => {
    const products = await this.productService.list();
    res.json({ products });
  };

  getById = async (req: Request, res: Response) => {
    const product = await this.productService.getById(parseId(req.params.id));
    res.json({ product });
  };
}
