import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { cartKey, fetchCart } from "../api/cart";
import { ApiError } from "../api/client";
import { orderKey, placeOrder } from "../api/orders";
import { productsKey } from "../api/products";
import { ErrorState, LoadingState } from "../components/StatusMessage";
import { formatPrice } from "../lib/format";

export function CheckoutPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: cart, isPending, error, refetch } = useQuery({ queryKey: cartKey, queryFn: fetchCart });

  const order = useMutation({
    mutationFn: placeOrder,
    onSuccess: (placed) => {
      queryClient.setQueryData(orderKey(placed.id), placed);
      navigate(`/orders/${placed.id}`, { replace: true });
      queryClient.setQueryData(cartKey, { items: [], total: 0 });
      queryClient.invalidateQueries({ queryKey: productsKey });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === "OUT_OF_STOCK") {
        queryClient.invalidateQueries({ queryKey: cartKey });
      }
    },
  });

  if (isPending) {
    return <LoadingState label="Loading checkout..." />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (cart.items.length === 0 && !order.isSuccess) {
    return <Navigate to="/cart" replace />;
  }

  const hasStockIssue = cart.items.some((item) => item.quantity > item.variant.stock);

  return (
    <section>
      <Link to="/cart" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        &larr; Back to cart
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="rounded-lg border border-slate-200 bg-white">
          <h2 className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">Review your order</h2>
          <ul className="divide-y divide-slate-200">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="h-16 w-16 shrink-0 rounded-md bg-slate-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{item.product.title}</p>
                  <p className="text-sm text-slate-500">
                    {item.product.variants.length > 1 && <>{item.variant.name} &middot; </>}
                    {item.quantity} &times; {formatPrice(item.product.price)}
                  </p>
                  {item.quantity > item.variant.stock && (
                    <p className="text-sm text-amber-700">Not enough stock for this item</p>
                  )}
                </div>
                <p className="shrink-0 font-semibold text-slate-900">{formatPrice(item.subtotal)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-slate-900">Order total</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="text-slate-900">{formatPrice(cart.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Shipping</dt>
              <dd className="text-slate-900">Free</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(cart.total)}</dd>
            </div>
          </dl>

          {order.error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {order.error.message}{" "}
              <Link to="/cart" className="font-semibold underline">
                Update cart
              </Link>
            </p>
          )}
          {hasStockIssue && !order.error && (
            <p className="mt-4 text-sm text-amber-700">
              Some items are no longer available in that quantity.{" "}
              <Link to="/cart" className="font-semibold underline">
                Update cart
              </Link>
            </p>
          )}

          <button
            type="button"
            onClick={() => order.mutate()}
            disabled={order.isPending || hasStockIssue}
            className="mt-5 h-11 w-full rounded-md bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {order.isPending ? "Placing order..." : "Place order"}
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">This is a demo. No payment will be taken.</p>
        </aside>
      </div>
    </section>
  );
}
