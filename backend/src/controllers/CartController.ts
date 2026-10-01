import type { Request, Response } from "express";
import { getUserId } from "../middleware/requireAuth.js";
import type { CartService } from "../services/CartService.js";
import { validateAddToCart, validateUpdateCartItem } from "../validators/cartValidator.js";
import { parseId } from "../validators/common.js";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  get = async (req: Request, res: Response) => {
    const cart = await this.cartService.getCart(getUserId(req));
    res.json({ cart });
  };

  add = async (req: Request, res: Response) => {
    const { variantId, quantity } = validateAddToCart(req.body);
    const cart = await this.cartService.addItem(getUserId(req), variantId, quantity);
    res.status(201).json({ cart });
  };

  update = async (req: Request, res: Response) => {
    const input = validateUpdateCartItem(req.body);
    const cart = await this.cartService.updateItem(getUserId(req), parseId(req.params.itemId, "itemId"), input);
    res.json({ cart });
  };

  remove = async (req: Request, res: Response) => {
    const cart = await this.cartService.removeItem(getUserId(req), parseId(req.params.itemId, "itemId"));
    res.json({ cart });
  };
}
