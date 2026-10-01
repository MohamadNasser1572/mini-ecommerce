import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { cartKey, fetchCart } from "../api/cart";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: cart } = useQuery({ queryKey: cartKey, queryFn: fetchCart });
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const links = (
    <>
      <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
        Products
      </NavLink>
      <NavLink to="/wishlist" className={navLinkClass} onClick={closeMenu}>
        Wishlist
      </NavLink>
      <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
        <span className="inline-flex items-center gap-2">
          Cart
          {cartCount > 0 && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{cartCount}</span>
          )}
        </span>
      </NavLink>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="inline-flex h-10 items-center text-lg font-bold text-slate-900" onClick={closeMenu}>
            Mini<span className="text-indigo-600">Shop</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">{links}</nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="max-w-40 truncate text-sm text-slate-500">{user?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Log out
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">{links}</nav>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <span className="truncate text-sm text-slate-500">{user?.email}</span>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
