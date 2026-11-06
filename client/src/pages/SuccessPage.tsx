import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';

export function SuccessPage() {
  const { site } = useSite();
  const { user } = useAuth();
  const location = useLocation();
  const state = (location.state as { orderId?: string; emailSent?: boolean } | null) ?? {};
  const { orderId, emailSent } = state;
  const signedIn = Boolean(user && user.role !== 'admin');

  return (
    <div className="pt-32 pb-24 container-page max-w-lg text-center bg-bg min-h-screen">
      <span className="section-label">Thank you</span>
      <h1 className="text-3xl font-semibold text-text mb-3">Order received</h1>
      {orderId && <p className="text-accent font-medium mb-4">Order {orderId}</p>}
      {emailSent !== false ? (
        <p className="text-text-muted leading-relaxed mb-4 text-sm">
          The same order is in your inbox from Khan Scents Official. Reply to that email to reach us at {site.email}.
        </p>
      ) : (
        <p className="text-text-muted leading-relaxed mb-4 text-sm">
          Your order was saved. If you do not see a confirmation shortly, check spam or write to {site.email} with your order ID.
        </p>
      )}
      {signedIn ? (
        <p className="text-text-muted leading-relaxed mb-8 text-sm">
          This order is also in your account so you can track it anytime.
        </p>
      ) : (
        <p className="text-text-muted leading-relaxed mb-8 text-sm">
          Sign in or create an account with the same email to see this order on the website.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/shop" className="btn-primary">Continue shopping</Link>
        {signedIn ? (
          <Link to="/account" className="btn-outline">View my orders</Link>
        ) : (
          <Link to="/login?redirect=/account" className="btn-outline">Sign in to track orders</Link>
        )}
      </div>
      <p className="mt-10 text-sm text-text-muted">
        Questions? <a href={`mailto:${site.email}`} className="text-accent hover:underline">{site.email}</a>
      </p>
    </div>
  );
}
