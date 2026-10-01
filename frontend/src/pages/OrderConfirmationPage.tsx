import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { fetchOrder, orderKey } from "../api/orders";
import { ErrorState, LoadingState } from "../components/StatusMessage";
import { formatDate, formatPrice } from "../lib/format";

export function OrderConfirmationPage() {
  const id = Number(useParams().id);
  const validId = Number.isInteger(id) && id > 0;
  const { data: order, isPending, error, refetch } = useQuery({
    queryKey: orderKey(id),
    queryFn: () => fetchOrder(id),
    enabled: validId,
  });

  if (!validId || (error instanceof ApiError && error.status === 404)) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-slate-900">Order not found</p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Back to products
        </Link>
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (isPending) {
    return <LoadingState label="Loading your order..." />;
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Order #{order.id} &middot; placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-200">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{item.productTitle}</p>
                <p className="text-sm text-slate-500">
                  {item.variantName !== "Default" && <>{item.variantName} &middot; </>}
                  {item.quantity} &times; {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-slate-900">{formatPrice(item.unitPrice * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-slate-200 p-4 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
