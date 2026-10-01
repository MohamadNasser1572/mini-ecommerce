import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import {
  authController,
  cartController,
  orderController,
  productController,
  requireAuth,
  wishlistController,
} from "./container.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { cartRoutes } from "./routes/cartRoutes.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { wishlistRoutes } from "./routes/wishlistRoutes.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes(authController, requireAuth));
app.use("/api/products", requireAuth, productRoutes(productController));
app.use("/api/cart", requireAuth, cartRoutes(cartController));
app.use("/api/wishlist", requireAuth, wishlistRoutes(wishlistController));
app.use("/api/orders", requireAuth, orderRoutes(orderController));

app.use(notFound);
app.use(errorHandler);
