const benefits = [
  { title: 'Premium quality', text: 'Carefully selected fragrance oils and materials.' },
  { title: 'Luxury-inspired', text: 'Inspired by iconic fragrance profiles.' },
  { title: 'Nationwide delivery', text: 'Delivery across Pakistan.' },
  { title: 'Customer first', text: 'Support before and after your purchase.' },
];

export function WhyKhanScents() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page">
        <p className="section-label">Why us</p>
        <h2 className="font-display text-4xl md:text-5xl text-ivory mb-16 italic">Why Khan Scents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {benefits.map((b) => (
            <div key={b.title}>
              <h3 className="font-display text-xl text-ivory mb-2">{b.title}</h3>
              <p className="text-sm text-ivory-dim leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
