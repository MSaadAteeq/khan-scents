import { Link, useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export function SuccessPage() {
  const { site } = useSite();
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  return (
    <div className="pt-32 pb-24 container-page max-w-lg text-center bg-bg min-h-screen">
      <span className="section-label">Thank you</span>
      <h1 className="text-3xl font-semibold text-text mb-3">Order received</h1>
      {orderId && <p className="text-accent font-medium mb-4">Order {orderId}</p>}
      <p className="text-text-muted leading-relaxed mb-8 text-sm">
        Your order has been saved. Check your email for confirmation — we will send updates when your order is confirmed, shipped, or delivered.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/shop" className="btn-primary">Continue shopping</Link>
        <Link to="/account" className="btn-outline">View my orders</Link>
      </div>
      <p className="mt-10 text-sm text-text-muted">
        Questions? <a href={`mailto:${site.email}`} className="text-accent hover:underline">{site.email}</a>
      </p>
    </div>
  );
}
