import { useQuery } from "@tanstack/react-query";
import { fetchProducts, productsKey } from "../api/products";
import { ProductCard } from "../components/ProductCard";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusMessage";

export function ProductListPage() {
  const { data: products, isPending, error, refetch } = useQuery({
    queryKey: productsKey,
    queryFn: fetchProducts,
  });

  if (isPending) {
    return <LoadingState label="Loading products..." />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }
  if (products.length === 0) {
    return <EmptyState title="No products yet" />;
  }

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <p className="text-sm text-slate-500">{products.length} items</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
