import { Link, useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export function SuccessPage() {
  const { site } = useSite();
  const location = useLocation();
  const state = (location.state as { orderId?: string; emailSent?: boolean } | null) ?? {};
  const { orderId, emailSent } = state;

  return (
    <div className="pt-32 pb-24 container-page max-w-lg text-center bg-bg min-h-screen">
      <span className="section-label">Thank you</span>
      <h1 className="text-3xl font-semibold text-text mb-3">Order received</h1>
      {orderId && <p className="text-accent font-medium mb-4">Order {orderId}</p>}
      {emailSent !== false ? (
        <p className="text-text-muted leading-relaxed mb-8 text-sm">
          A confirmation has been sent to the email address you provided. We will email you again when your order status changes.
        </p>
      ) : (
        <p className="text-text-muted leading-relaxed mb-8 text-sm">
          Your order was saved. If you do not receive a confirmation email within a few minutes, check your spam folder or contact us with your order ID.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/shop" className="btn-primary">Continue shopping</Link>
        <Link to="/login?redirect=/account" className="btn-outline">Sign in to track orders</Link>
      </div>
      <p className="mt-10 text-sm text-text-muted">
        Questions? <a href={`mailto:${site.email}`} className="text-accent hover:underline">{site.email}</a>
      </p>
    </div>
  );
}
