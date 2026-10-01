import type { Request, Response } from "express";
import { getUserId } from "../middleware/requireAuth.js";
import type { OrderService } from "../services/OrderService.js";
import { parseId } from "../validators/common.js";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  place = async (req: Request, res: Response) => {
    const order = await this.orderService.placeOrder(getUserId(req));
    res.status(201).json({ order });
  };

  getById = async (req: Request, res: Response) => {
    const order = await this.orderService.getOrder(getUserId(req), parseId(req.params.id));
    res.json({ order });
  };
}
