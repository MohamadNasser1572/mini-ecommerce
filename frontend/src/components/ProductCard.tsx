import { Link } from "react-router-dom";
import type { Product } from "../api/types";
import { formatPrice } from "../lib/format";

const MAX_CHIPS = 3;

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.variants.some((variant) => variant.stock > 0);
  const hasOptions = product.variants.length > 1;
  const chips = product.variants.slice(0, MAX_CHIPS);
  const hiddenCount = product.variants.length - chips.length;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {!inStock && (
          <span className="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h2 className="line-clamp-2 text-sm font-medium text-slate-900 sm:text-base">{product.title}</h2>
        <p className="font-semibold text-slate-900">{formatPrice(product.price)}</p>
        {hasOptions && (
          <ul className="mt-auto flex flex-wrap gap-1">
            {chips.map((variant) => (
              <li
                key={variant.id}
                className={`rounded border px-1.5 py-0.5 text-xs ${
                  variant.stock > 0 ? "border-slate-300 text-slate-600" : "border-slate-200 text-slate-400 line-through"
                }`}
              >
                {variant.name}
              </li>
            ))}
            {hiddenCount > 0 && <li className="px-1 py-0.5 text-xs text-slate-500">+{hiddenCount} more</li>}
          </ul>
        )}
      </div>
    </Link>
  );
}
