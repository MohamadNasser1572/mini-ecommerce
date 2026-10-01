import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedProduct = {
  slug: string;
  title: string;
  description: string;
  price: number;
  variants: { name: string; stock: number }[];
};

const products: SeedProduct[] = [
  {
    slug: "classic-cotton-tshirt",
    title: "Classic Cotton T-Shirt",
    description:
      "A soft, breathable 100% cotton t-shirt with a relaxed fit. Pre-shrunk fabric keeps its shape wash after wash, making it an everyday essential.",
    price: 1999,
    variants: [
      { name: "Black / S", stock: 12 },
      { name: "Black / M", stock: 20 },
      { name: "Black / L", stock: 8 },
      { name: "White / M", stock: 15 },
      { name: "White / L", stock: 0 },
    ],
  },
  {
    slug: "slim-fit-denim-jeans",
    title: "Slim Fit Denim Jeans",
    description:
      "Stretch denim jeans with a modern slim cut. Five-pocket styling, reinforced stitching and a comfortable mid-rise waist.",
    price: 4999,
    variants: [
      { name: "30W", stock: 6 },
      { name: "32W", stock: 10 },
      { name: "34W", stock: 4 },
    ],
  },
  {
    slug: "wireless-headphones",
    title: "Wireless Over-Ear Headphones",
    description:
      "Bluetooth 5.3 headphones with active noise cancellation, 40-hour battery life and plush memory-foam ear cushions for all-day comfort.",
    price: 12999,
    variants: [
      { name: "Matte Black", stock: 9 },
      { name: "Silver", stock: 5 },
      { name: "Navy Blue", stock: 3 },
    ],
  },
  {
    slug: "smartphone-x",
    title: "Smartphone X",
    description:
      "6.5-inch OLED display, triple-lens camera system and an all-day battery. Ships unlocked and ready for any carrier.",
    price: 69900,
    variants: [
      { name: "128GB", stock: 7 },
      { name: "256GB", stock: 4 },
      { name: "512GB", stock: 2 },
    ],
  },
  {
    slug: "running-sneakers",
    title: "Lightweight Running Sneakers",
    description:
      "Breathable mesh upper with a responsive foam midsole. Built for daily runs, gym sessions and long days on your feet.",
    price: 8999,
    variants: [
      { name: "EU 40", stock: 5 },
      { name: "EU 41", stock: 8 },
      { name: "EU 42", stock: 11 },
      { name: "EU 43", stock: 6 },
      { name: "EU 44", stock: 0 },
    ],
  },
  {
    slug: "insulated-water-bottle",
    title: "Insulated Water Bottle",
    description:
      "Double-wall stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. Leak-proof lid and BPA-free.",
    price: 2499,
    variants: [
      { name: "500ml", stock: 25 },
      { name: "750ml", stock: 18 },
      { name: "1L", stock: 10 },
    ],
  },
  {
    slug: "hooded-sweatshirt",
    title: "Fleece Hooded Sweatshirt",
    description:
      "Brushed fleece hoodie with a kangaroo pocket and adjustable drawstring hood. Warm, cosy and perfect for layering.",
    price: 3999,
    variants: [
      { name: "Grey / M", stock: 9 },
      { name: "Grey / L", stock: 7 },
      { name: "Green / M", stock: 4 },
    ],
  },
  {
    slug: "leather-wallet",
    title: "Genuine Leather Wallet",
    description:
      "Slim bifold wallet crafted from full-grain leather with six card slots, a cash compartment and RFID-blocking lining.",
    price: 3499,
    variants: [{ name: "Default", stock: 30 }],
  },
  {
    slug: "mechanical-keyboard",
    title: "Mechanical Keyboard",
    description:
      "Compact 75% mechanical keyboard with hot-swappable switches, per-key RGB lighting and a detachable USB-C cable.",
    price: 10999,
    variants: [{ name: "Default", stock: 14 }],
  },
  {
    slug: "ergonomic-mouse",
    title: "Ergonomic Wireless Mouse",
    description:
      "Vertical ergonomic design that reduces wrist strain. Adjustable DPI, silent clicks and up to 3 months on a single charge.",
    price: 3999,
    variants: [{ name: "Default", stock: 22 }],
  },
  {
    slug: "ceramic-coffee-mug",
    title: "Ceramic Coffee Mug",
    description:
      "Hand-glazed 350ml ceramic mug. Dishwasher and microwave safe, with a comfortable wide handle.",
    price: 1299,
    variants: [{ name: "Default", stock: 40 }],
  },
  {
    slug: "canvas-backpack",
    title: "Canvas Backpack",
    description:
      "Water-resistant waxed canvas backpack with a padded 15-inch laptop sleeve, multiple organiser pockets and leather trim.",
    price: 5999,
    variants: [{ name: "Default", stock: 3 }],
  },
  {
    slug: "desk-lamp",
    title: "LED Desk Lamp",
    description:
      "Dimmable LED desk lamp with five colour temperatures, a flexible arm and a built-in USB charging port.",
    price: 2999,
    variants: [{ name: "Default", stock: 16 }],
  },
  {
    slug: "yoga-mat",
    title: "Non-Slip Yoga Mat",
    description:
      "6mm thick eco-friendly TPE mat with a non-slip texture on both sides. Includes a carrying strap.",
    price: 2799,
    variants: [{ name: "Default", stock: 0 }],
  },
  {
    slug: "sunglasses",
    title: "Polarized Sunglasses",
    description:
      "Lightweight frames with polarized UV400 lenses that cut glare and protect your eyes. Comes with a hard case.",
    price: 4499,
    variants: [{ name: "Default", stock: 11 }],
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: "demo@shop.com",
      name: "Demo User",
      passwordHash: await bcrypt.hash("password123", 10),
    },
  });

  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        imageUrl: `/products/${p.slug}.jpg`,
        variants: { create: p.variants },
      },
    });
  }

  console.log(`Seeded ${products.length} products and 1 demo user (demo@shop.com / password123)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
