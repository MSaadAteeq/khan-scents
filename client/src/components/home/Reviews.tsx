import { reviews } from '../../data/site';

export function Reviews() {
  return (
    <section className="py-20 md:py-28 bg-surface-muted">
      <div className="container-page">
        <span className="section-label">Reviews</span>
        <h2 className="section-title">What customers say</h2>
        <p className="text-text-muted max-w-lg mb-10 text-sm leading-relaxed">
          Early feedback from customers across Pakistan. Send us your photo review after your first order.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <blockquote key={review.name} className="card p-6">
              <p className="text-accent text-sm mb-3">
                {'★'.repeat(review.rating)}
                <span className="text-border">{'★'.repeat(5 - review.rating)}</span>
              </p>
              <p className="text-sm text-text leading-relaxed mb-5">"{review.text}"</p>
              <footer className="text-sm text-text-muted">
                <span className="font-medium text-text">{review.name}</span> · {review.city}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
