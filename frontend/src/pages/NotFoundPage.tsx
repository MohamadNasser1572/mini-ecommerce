import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <p className="mt-4 text-lg font-medium text-slate-900">Page not found</p>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Back to products
      </Link>
    </div>
  );
}
