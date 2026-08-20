import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/settings', label: 'Contact & site' },
  { to: '/admin/faqs', label: 'FAQs' },
  { to: '/admin/orders', label: 'Orders' },
];

export function AdminLayout() {
  const { username, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="container-page flex items-center justify-between h-14">
          <Link to="/admin" className="font-sans font-bold tracking-[0.12em] uppercase text-sm">
            Khan Scents Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-text-muted hover:text-text">
              View store
            </Link>
            <span className="text-sm text-text-muted hidden sm:inline">{username}</span>
            <button type="button" onClick={logout} className="text-sm text-accent hover:underline">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8 flex flex-col md:flex-row gap-8">
        <nav className="md:w-48 shrink-0 flex md:flex-col gap-1 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
