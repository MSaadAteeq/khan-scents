import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../lib/api';
import { formatPrice } from '../lib/format';
import type { Order } from '../types/product';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function AccountPage() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'admin') return;
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-page text-center text-text-muted min-h-screen">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      <div className="container-page max-w-2xl">
        <header className="page-header flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-label">My account</span>
            <h1 className="section-title !mb-0">Hello, {user.name}</h1>
          </div>
          <button type="button" onClick={logout} className="text-sm text-accent hover:underline">
            Sign out
          </button>
        </header>

        <p className="page-content text-text-muted text-sm mb-8">{user.email}</p>

        <h2 className="font-heading text-xl font-semibold mb-4">Your orders</h2>

        {ordersLoading ? (
          <p className="text-text-muted text-sm">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-text-muted mb-4">No orders yet.</p>
            <Link to="/shop" className="btn-primary inline-flex">
              Shop fragrances
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <p className="font-semibold">{order.id}</p>
                  <span className="text-sm px-2 py-0.5 rounded-full bg-surface-muted capitalize">
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                </p>
                <ul className="text-sm space-y-1 mb-3 text-text-muted">
                  {order.items.map((item) => (
                    <li key={item.slug}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
