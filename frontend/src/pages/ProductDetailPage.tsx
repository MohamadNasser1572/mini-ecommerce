import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToCart, cartKey } from "../api/cart";
import { ApiError } from "../api/client";
import { fetchProduct, productKey, productsKey } from "../api/products";
import type { Product } from "../api/types";
import { addToWishlist, wishlistKey } from "../api/wishlist";
import { ErrorState, LoadingState } from "../components/StatusMessage";
import { formatPrice } from "../lib/format";

const MAX_QUANTITY = 99;

type Feedback = { type: "success" | "error"; message: string; link?: { to: string; label: string } };

export function ProductDetailPage() {
  const id = Number(useParams().id);
  const { data: product, isPending, error, refetch } = useQuery({
    queryKey: productKey(id),
    queryFn: () => fetchProduct(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  if (!Number.isInteger(id) || id <= 0 || (error instanceof ApiError && error.status === 404)) {
    return <ProductNotFound />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (isPending) {
    return <LoadingState label="Loading product..." />;
  }
  return <ProductDetail key={product.id} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const firstAvailable = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const maxQuantity = Math.min(variant.stock, MAX_QUANTITY);
  const outOfStock = variant.stock === 0;
  const hasOptions = product.variants.length > 1;

  const refreshProduct = () => {
    queryClient.invalidateQueries({ queryKey: productKey(product.id) });
    queryClient.invalidateQueries({ queryKey: productsKey, exact: true });
  };

  const cartMutation = useMutation({
    mutationFn: () => addToCart(variant.id, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKey, cart);
      setFeedback({ type: "success", message: "Added to your cart.", link: { to: "/cart", label: "View cart" } });
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err.message });
      if (err instanceof ApiError && err.code === "OUT_OF_STOCK") {
        refreshProduct();
      }
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: () => addToWishlist(variant.id),
    onSuccess: (items) => {
      queryClient.setQueryData(wishlistKey, items);
      setFeedback({
        type: "success",
        message: "Saved to your wishlist.",
        link: { to: "/wishlist", label: "View wishlist" },
      });
    },
    onError: (err) => setFeedback({ type: "error", message: err.message }),
  });

  function selectVariant(id: number) {
    setVariantId(id);
    setQuantity(1);
    setFeedback(null);
  }

  function changeQuantity(value: number) {
    if (Number.isNaN(value)) {
      return;
    }
    setQuantity(Math.max(1, Math.min(value, Math.max(maxQuantity, 1))));
  }

  return (
    <article>
      <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        &larr; All products
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
          <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{product.title}</h1>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatPrice(product.price)}</p>
          </div>

          <p className="leading-relaxed text-slate-600">{product.description}</p>

          {hasOptions && (
            <fieldset>
              <legend className="text-sm font-medium text-slate-900">
                Option: <span className="font-normal text-slate-600">{variant.name}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => selectVariant(v.id)}
                    aria-pressed={v.id === variant.id}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      v.id === variant.id
                        ? "border-indigo-600 bg-indigo-50 font-medium text-indigo-700"
                        : "border-slate-300 text-slate-700 hover:border-slate-400"
                    } ${v.stock === 0 ? "text-slate-400 line-through" : ""}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <StockLabel stock={variant.stock} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-fit items-center rounded-md border border-slate-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => changeQuantity(quantity - 1)}
                disabled={outOfStock || quantity <= 1}
                className="h-11 w-11 text-lg text-slate-700 disabled:text-slate-300"
              >
                &minus;
              </button>
              <input
                type="number"
                inputMode="numeric"
                aria-label="Quantity"
                min={1}
                max={maxQuantity}
                value={quantity}
                disabled={outOfStock}
                onChange={(event) => changeQuantity(event.target.valueAsNumber)}
                className="h-11 w-14 border-x border-slate-300 text-center text-base [appearance:textfield] disabled:bg-slate-50 [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => changeQuantity(quantity + 1)}
                disabled={outOfStock || quantity >= maxQuantity}
                className="h-11 w-11 text-lg text-slate-700 disabled:text-slate-300"
              >
                +
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 min-[400px]:flex-row">
              <button
                type="button"
                onClick={() => cartMutation.mutate()}
                disabled={outOfStock || cartMutation.isPending}
                className="h-11 flex-1 rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {cartMutation.isPending ? "Adding..." : outOfStock ? "Out of stock" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={() => wishlistMutation.mutate()}
                disabled={wishlistMutation.isPending}
                className="h-11 flex-1 rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {wishlistMutation.isPending ? "Saving..." : "Add to Wishlist"}
              </button>
            </div>
          </div>

          {feedback && (
            <p
              role="status"
              className={`rounded-md px-3 py-2 text-sm ${
                feedback.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}{" "}
              {feedback.link && (
                <Link to={feedback.link.to} className="font-semibold underline">
                  {feedback.link.label}
                </Link>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function StockLabel({ stock }: { stock: number }) {
  if (stock === 0) {
    return <p className="text-sm font-medium text-red-600">Out of stock</p>;
  }
  if (stock <= 5) {
    return <p className="text-sm font-medium text-amber-600">Only {stock} left in stock</p>;
  }
  return <p className="text-sm font-medium text-green-700">{stock} in stock</p>;
}

function ProductNotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-lg font-medium text-slate-900">Product not found</p>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Back to products
      </Link>
    </div>
  );
}
