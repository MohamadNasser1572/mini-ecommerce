import { env } from "./config/env.js";
import { AuthController } from "./controllers/AuthController.js";
import { CartController } from "./controllers/CartController.js";
import { OrderController } from "./controllers/OrderController.js";
import { ProductController } from "./controllers/ProductController.js";
import { WishlistController } from "./controllers/WishlistController.js";
import { prisma, transaction } from "./lib/prisma.js";
import { createRequireAuth } from "./middleware/requireAuth.js";
import { CartRepository } from "./repositories/CartRepository.js";
import { OrderRepository } from "./repositories/OrderRepository.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { WishlistRepository } from "./repositories/WishlistRepository.js";
import { AuthService } from "./services/AuthService.js";
import { CartService } from "./services/CartService.js";
import { OrderService } from "./services/OrderService.js";
import { ProductService } from "./services/ProductService.js";
import { WishlistService } from "./services/WishlistService.js";

const userRepository = new UserRepository(prisma);
const productRepository = new ProductRepository(prisma);
const cartRepository = new CartRepository(prisma);
const wishlistRepository = new WishlistRepository(prisma);
const orderRepository = new OrderRepository(prisma);

const authService = new AuthService(userRepository, env.jwtSecret);
const productService = new ProductService(productRepository);
const cartService = new CartService(cartRepository, productRepository, transaction);
const wishlistService = new WishlistService(wishlistRepository, productRepository, cartService, transaction);
const orderService = new OrderService(orderRepository, cartRepository, productRepository, transaction);

export const requireAuth = createRequireAuth(authService);

export const authController = new AuthController(authService);
export const productController = new ProductController(productService);
export const cartController = new CartController(cartService);
export const wishlistController = new WishlistController(wishlistService);
export const orderController = new OrderController(orderService);
