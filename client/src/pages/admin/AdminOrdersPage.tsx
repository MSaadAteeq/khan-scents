import { useEffect, useState } from 'react';
import { adminGetOrders, adminUpdateOrderStatus } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import type { Order } from '../../types/product';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminGetOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await adminUpdateOrderStatus(id, status);
    load();
  };

  if (loading) return <p className="text-text-muted">Loading orders…</p>;

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold mb-4">Orders</h1>
        <p className="text-text-muted">No orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <select
                className="input-field w-auto text-sm"
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <p className="text-sm mb-1"><strong>{order.customer.fullName}</strong> · {order.customer.phone}</p>
            <p className="text-sm text-text-muted mb-3">{order.customer.address}, {order.customer.city}</p>
            <ul className="text-sm space-y-1 mb-3">
              {order.items.map((item) => (
                <li key={item.slug}>{item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}</li>
              ))}
            </ul>
            <p className="font-semibold">{formatPrice(order.total)} <span className="text-text-muted font-normal text-sm">({order.paymentMethod})</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
