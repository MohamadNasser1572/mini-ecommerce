import type { Request, Response } from "express";
import { getUserId } from "../middleware/requireAuth.js";
import type { WishlistService } from "../services/WishlistService.js";
import { parseId } from "../validators/common.js";
import { validateAddToWishlist } from "../validators/wishlistValidator.js";

export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  list = async (req: Request, res: Response) => {
    const items = await this.wishlistService.list(getUserId(req));
    res.json({ items });
  };

  add = async (req: Request, res: Response) => {
    const { variantId } = validateAddToWishlist(req.body);
    const items = await this.wishlistService.addItem(getUserId(req), variantId);
    res.status(201).json({ items });
  };

  remove = async (req: Request, res: Response) => {
    const items = await this.wishlistService.removeItem(getUserId(req), parseId(req.params.itemId, "itemId"));
    res.json({ items });
  };

  moveToCart = async (req: Request, res: Response) => {
    const items = await this.wishlistService.moveToCart(getUserId(req), parseId(req.params.itemId, "itemId"));
    res.json({ items });
  };
}
