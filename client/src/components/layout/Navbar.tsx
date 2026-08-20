import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function MenuIcon({ open, light }: { open: boolean; light: boolean }) {
  const bar = light ? 'bg-white' : 'bg-text';
  return (
    <span className="relative flex h-5 w-6 flex-col justify-center" aria-hidden>
      <span
        className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ${bar} ${
          open ? 'rotate-45 translate-y-0' : '-translate-y-2'
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ${bar} ${
          open ? 'opacity-0 scale-x-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ${bar} ${
          open ? '-rotate-45 translate-y-0' : 'translate-y-2'
        }`}
      />
    </span>
  );
}

export function Navbar() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lightText = isHome && !scrolled;
  const transparentNav = isHome && !scrolled && !menuOpen;

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
        transparentNav
          ? 'bg-transparent'
          : 'bg-surface/95 backdrop-blur-md border-b border-border shadow-sm'
      }`}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link
          to="/"
          className={`font-sans text-base font-bold tracking-[0.18em] uppercase ${
            lightText ? 'text-white' : 'text-text'
          }`}
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
                  lightText
                    ? isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
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
            className={`relative text-sm font-medium ${
              lightText ? 'text-white hover:text-white/90' : 'text-text-muted hover:text-text'
            }`}
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
            className="md:hidden flex items-center justify-center p-2 -mr-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <MenuIcon open={menuOpen} light={lightText} />
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
