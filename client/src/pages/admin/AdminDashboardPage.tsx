import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold mb-2">Dashboard</h1>
      <p className="text-text-muted mb-8">Manage your Khan Scents store from here.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { to: '/admin/products', title: 'Products', desc: 'Add, edit, or remove fragrances' },
          { to: '/admin/reviews', title: 'Reviews', desc: 'Manage customer testimonials' },
          { to: '/admin/settings', title: 'Contact & site', desc: 'Phone, email, WhatsApp, social links' },
          { to: '/admin/faqs', title: 'FAQs', desc: 'Update help section questions' },
          { to: '/admin/orders', title: 'Orders', desc: 'View and update order status' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="card p-5 hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
            <p className="text-sm text-text-muted">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
