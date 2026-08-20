import { FormEvent, useEffect, useState } from 'react';
import { adminCreateReview, adminDeleteReview, adminGetSite, adminUpdateReview } from '../../lib/api';
import type { Review } from '../../types/product';

const empty = { name: '', city: '', rating: 5, text: '' };

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminGetSite()
      .then((data) => setReviews(data.reviews))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(empty);
    setEditId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId) {
      await adminUpdateReview(editId, form);
    } else {
      await adminCreateReview(form);
    }
    resetForm();
    load();
  };

  const startEdit = (review: Review) => {
    setEditId(review.id);
    setForm({ name: review.name, city: review.city, rating: review.rating, text: review.text });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await adminDeleteReview(id);
    load();
  };

  if (loading) return <p className="text-text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold mb-6">Reviews</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-xl mb-8">
        <h2 className="font-semibold">{editId ? 'Edit review' : 'Add review'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Name</span>
            <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">City</span>
            <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Rating (1–5)</span>
            <input type="number" min={1} max={5} className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-text-muted mb-1 block">Review text</span>
          <textarea className="input-field min-h-24" required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        </label>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{editId ? 'Save' : 'Add review'}</button>
          {editId && (
            <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="card p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <p className="text-accent text-sm mb-1">{'★'.repeat(r.rating)}</p>
              <p className="text-sm mb-2">"{r.text}"</p>
              <p className="text-xs text-text-muted">{r.name} · {r.city}</p>
            </div>
            <div className="flex gap-3 text-sm shrink-0">
              <button type="button" className="text-accent hover:underline" onClick={() => startEdit(r)}>Edit</button>
              <button type="button" className="text-red-600 hover:underline" onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
