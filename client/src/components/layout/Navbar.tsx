import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
        scrolled || menuOpen ? 'bg-charcoal/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex items-center justify-between h-14 md:h-16">
        <Link
          to="/"
          className="font-display text-xl md:text-2xl text-ivory italic"
          onClick={() => setMenuOpen(false)}
        >
          Khan Scents
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-ivory' : 'text-ivory-dim hover:text-ivory'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="relative text-sm text-ivory-dim hover:text-ivory transition-colors"
          >
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-4 min-w-4 h-4 px-1 rounded-full bg-ivory text-charcoal text-[10px] font-medium flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="md:hidden text-sm text-ivory"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-charcoal/95 backdrop-blur-lg px-6 py-10 space-y-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block font-display text-3xl text-ivory italic"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
