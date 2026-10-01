export type User = {
  id: number;
  email: string;
  name: string;
};

export type Variant = {
  id: number;
  name: string;
  stock: number;
};

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  variants: Variant[];
};

export type CartItem = {
  id: number;
  quantity: number;
  subtotal: number;
  variant: Variant;
  product: Pick<Product, "id" | "title" | "price" | "imageUrl" | "variants">;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export type WishlistItem = {
  id: number;
  productId: number;
  variantId: number;
  product: Omit<Product, "variants">;
  variant: Variant;
};
