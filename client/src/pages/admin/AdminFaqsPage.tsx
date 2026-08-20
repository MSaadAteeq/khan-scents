import { FormEvent, useEffect, useState } from 'react';
import { adminCreateFaq, adminDeleteFaq, adminGetSite, adminUpdateFaq } from '../../lib/api';
import type { Faq } from '../../types/product';

const empty = { question: '', answer: '' };

export function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminGetSite()
      .then((data) => setFaqs(data.faqs))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId) {
      await adminUpdateFaq(editId, form);
    } else {
      await adminCreateFaq(form);
    }
    setForm(empty);
    setEditId(null);
    load();
  };

  if (loading) return <p className="text-text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold mb-6">FAQs</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-xl mb-8">
        <h2 className="font-semibold">{editId ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <label className="block text-sm">
          <span className="text-text-muted mb-1 block">Question</span>
          <input className="input-field" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        </label>
        <label className="block text-sm">
          <span className="text-text-muted mb-1 block">Answer</span>
          <textarea className="input-field min-h-24" required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
        </label>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{editId ? 'Save' : 'Add FAQ'}</button>
          {editId && (
            <button type="button" className="btn-outline" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="card p-4">
            <p className="font-medium mb-2">{f.question}</p>
            <p className="text-sm text-text-muted mb-3">{f.answer}</p>
            <div className="flex gap-3 text-sm">
              <button type="button" className="text-accent hover:underline" onClick={() => { setEditId(f.id); setForm({ question: f.question, answer: f.answer }); }}>Edit</button>
              <button type="button" className="text-red-600 hover:underline" onClick={async () => { if (confirm('Delete?')) { await adminDeleteFaq(f.id); load(); } }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
