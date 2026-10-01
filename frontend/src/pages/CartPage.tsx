import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cartKey, fetchCart, removeCartItem, updateCartItem } from "../api/cart";
import { ApiError } from "../api/client";
import type { Cart, CartItem } from "../api/types";
import { QuantityStepper } from "../components/QuantityStepper";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusMessage";
import { formatPrice } from "../lib/format";

const MAX_QUANTITY = 99;

export function CartPage() {
  const { data: cart, isPending, error, refetch } = useQuery({ queryKey: cartKey, queryFn: fetchCart });

  if (isPending) {
    return <LoadingState label="Loading your cart..." />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (cart.items.length === 0) {
    return (
      <EmptyState title="Your cart is empty">
        <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-700">
          Browse products
        </Link>
      </EmptyState>
    );
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasStockIssue = cart.items.some((item) => item.quantity > item.variant.stock);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Shopping cart</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {cart.items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </ul>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Items</dt>
              <dd className="text-slate-900">{itemCount}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(cart.total)}</dd>
            </div>
          </dl>

          {hasStockIssue ? (
            <>
              <p className="mt-4 text-sm text-amber-700">Fix the stock issues above to continue.</p>
              <button
                type="button"
                disabled
                className="mt-3 h-11 w-full cursor-not-allowed rounded-md bg-slate-300 text-sm font-semibold text-white"
              >
                Proceed to checkout
              </button>
            </>
          ) : (
            <Link
              to="/checkout"
              className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Proceed to checkout
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const onSuccess = (cart: Cart) => {
    setError(null);
    queryClient.setQueryData(cartKey, cart);
  };
  const onError = (err: Error) => {
    setError(err.message);
    if (err instanceof ApiError && err.code === "OUT_OF_STOCK") {
      queryClient.invalidateQueries({ queryKey: cartKey });
    }
  };

  const update = useMutation({
    mutationFn: (data: { quantity?: number; variantId?: number }) => updateCartItem(item.id, data),
    onSuccess,
    onError,
  });
  const remove = useMutation({ mutationFn: () => removeCartItem(item.id), onSuccess, onError });

  const busy = update.isPending || remove.isPending;
  const { product, variant } = item;
  const hasOptions = product.variants.length > 1;

  return (
    <li className={`flex gap-3 p-4 sm:gap-4 ${busy ? "opacity-60" : ""}`}>
      <Link to={`/products/${product.id}`} className="shrink-0">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-20 w-20 rounded-md bg-slate-100 object-cover sm:h-24 sm:w-24"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${product.id}`}
              className="line-clamp-2 font-medium text-slate-900 hover:text-indigo-600"
            >
              {product.title}
            </Link>
            <p className="mt-0.5 text-sm text-slate-500">{formatPrice(product.price)} each</p>
          </div>
          <p className="shrink-0 font-semibold text-slate-900">{formatPrice(item.subtotal)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasOptions && (
            <select
              aria-label="Option"
              value={variant.id}
              disabled={busy}
              onChange={(event) => update.mutate({ variantId: Number(event.target.value) })}
              className="h-10 max-w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id} disabled={v.stock === 0 && v.id !== variant.id}>
                  {v.name}
                  {v.stock === 0 ? " (out of stock)" : ""}
                </option>
              ))}
            </select>
          )}
          <QuantityStepper
            value={item.quantity}
            max={Math.min(variant.stock, MAX_QUANTITY)}
            onChange={(quantity) => update.mutate({ quantity })}
            disabled={busy}
          />
          <button
            type="button"
            onClick={() => remove.mutate()}
            disabled={busy}
            className="ml-auto text-sm font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>

        {item.quantity > variant.stock && (
          <p className="text-sm text-amber-700">
            {variant.stock === 0
              ? "This option is out of stock. Remove it or choose another option."
              : `Only ${variant.stock} left in stock. Lower the quantity to continue.`}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </li>
  );
}
