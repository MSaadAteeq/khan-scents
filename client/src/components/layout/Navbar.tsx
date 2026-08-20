import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onHero = isHome && !scrolled && !menuOpen;
  const light = onHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onHero
          ? 'bg-transparent'
          : 'bg-surface/95 backdrop-blur-md border-b border-border shadow-sm'
      }`}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link
          to="/"
          className={`text-lg font-semibold tracking-tight ${light ? 'text-white' : 'text-text'}`}
          onClick={() => setMenuOpen(false)}
        >
          Khan Scents
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  light
                    ? isActive
                      ? 'text-white'
                      : 'text-white/75 hover:text-white'
                    : isActive
                      ? 'text-text'
                      : 'text-text-muted hover:text-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            to="/cart"
            className={`relative text-sm font-medium ${light ? 'text-white/90 hover:text-white' : 'text-text-muted hover:text-text'}`}
          >
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-4 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={`md:hidden text-sm font-medium ${light ? 'text-white' : 'text-text'}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-8 space-y-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-2xl font-semibold text-text"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
