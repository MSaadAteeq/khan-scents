import { reviews } from '../../data/site';

export function Reviews() {
  return (
    <section className="py-20 md:py-28 bg-charcoal-soft border-y border-[var(--color-line)]">
      <div className="container-page">
        <p className="text-xs uppercase tracking-widest-plus text-gold mb-3">Social proof</p>
        <h2 className="font-display text-4xl md:text-5xl text-ivory mb-4">Customer Reviews</h2>
        <p className="text-ivory-dim max-w-xl mb-12">
          Early love notes from customers across Pakistan. Real photos coming soon — send us yours
          after your first order.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="border border-[var(--color-line)] bg-charcoal p-6 md:p-8"
            >
              <p className="text-gold text-sm tracking-widest mb-4">
                {'★'.repeat(review.rating)}
                <span className="text-ivory-dim/40">{'★'.repeat(5 - review.rating)}</span>
              </p>
              <p className="text-ivory leading-relaxed mb-6">“{review.text}”</p>
              <footer className="text-sm text-ivory-dim">
                <span className="text-ivory">{review.name}</span> · {review.city}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
