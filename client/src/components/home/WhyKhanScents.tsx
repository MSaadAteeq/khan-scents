const benefits = [
  { title: 'Premium quality', text: 'Carefully selected fragrance oils and materials.' },
  { title: 'Luxury-inspired', text: 'Inspired by iconic fragrance profiles.' },
  { title: 'Nationwide delivery', text: 'Flat PKR 300 across Pakistan.' },
  { title: 'Customer first', text: 'Support before and after your purchase.' },
];

export function WhyKhanScents() {
  return (
    <section className="py-20 md:py-28 bg-surface-muted">
      <div className="container-page">
        <span className="section-label">Why us</span>
        <h2 className="section-title">Why Khan Scents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <h3 className="text-base font-semibold text-text mb-2">{b.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
