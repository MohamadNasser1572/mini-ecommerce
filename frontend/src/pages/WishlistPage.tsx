import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cartKey } from "../api/cart";
import { ApiError } from "../api/client";
import type { WishlistItem } from "../api/types";
import { fetchWishlist, moveToCart, removeFromWishlist, wishlistKey } from "../api/wishlist";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusMessage";
import { formatPrice } from "../lib/format";

export function WishlistPage() {
  const { data: items, isPending, error, refetch } = useQuery({ queryKey: wishlistKey, queryFn: fetchWishlist });

  if (isPending) {
    return <LoadingState label="Loading your wishlist..." />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (items.length === 0) {
    return (
      <EmptyState title="Your wishlist is empty">
        Save products you like from their page.{" "}
        <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-700">
          Browse products
        </Link>
      </EmptyState>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Wishlist</h1>
        <p className="text-sm text-slate-500">{items.length} saved</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <WishlistCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function WishlistCard({ item }: { item: WishlistItem }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const onError = (err: Error) => {
    setError(err.message);
    if (err instanceof ApiError && err.code === "OUT_OF_STOCK") {
      queryClient.invalidateQueries({ queryKey: wishlistKey });
    }
  };

  const move = useMutation({
    mutationFn: () => moveToCart(item.id),
    onSuccess: (items) => {
      queryClient.setQueryData(wishlistKey, items);
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
    onError,
  });
  const remove = useMutation({
    mutationFn: () => removeFromWishlist(item.id),
    onSuccess: (items) => queryClient.setQueryData(wishlistKey, items),
    onError,
  });

  const busy = move.isPending || remove.isPending;
  const { product, variant } = item;
  const outOfStock = variant.stock === 0;

  return (
    <li className={`flex gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 ${busy ? "opacity-60" : ""}`}>
      <Link to={`/products/${product.id}`} className="shrink-0">
        <img src={product.imageUrl} alt={product.title} className="h-24 w-24 rounded-md bg-slate-100 object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link to={`/products/${product.id}`} className="line-clamp-2 font-medium text-slate-900 hover:text-indigo-600">
          {product.title}
        </Link>
        {variant.name !== "Default" && <p className="text-sm text-slate-500">{variant.name}</p>}
        <p className="font-semibold text-slate-900">{formatPrice(product.price)}</p>
        {outOfStock && <p className="text-sm font-medium text-red-600">Out of stock</p>}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
          <button
            type="button"
            onClick={() => move.mutate()}
            disabled={busy || outOfStock}
            className="h-10 rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {move.isPending ? "Moving..." : "Move to cart"}
          </button>
          <button
            type="button"
            onClick={() => remove.mutate()}
            disabled={busy}
            className="h-10 px-1 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
