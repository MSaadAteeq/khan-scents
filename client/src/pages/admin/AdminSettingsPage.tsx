import { FormEvent, useEffect, useState } from 'react';
import { adminGetSite, adminUpdateSite } from '../../lib/api';
import type { SiteSettings } from '../../types/product';

export function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminGetSite().then((data) => setForm(data.site));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setMessage('');
    try {
      await adminUpdateSite(form);
      setMessage('Settings saved.');
    } catch {
      setMessage('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-text-muted">Loading…</p>;

  const field = (key: keyof SiteSettings, label: string, type = 'text') => (
    <label key={key} className="block text-sm">
      <span className="text-text-muted mb-1 block">{label}</span>
      <input
        type={type}
        className="input-field"
        value={String(form[key] ?? '')}
        onChange={(e) =>
          setForm({
            ...form,
            [key]: type === 'number' ? Number(e.target.value) : e.target.value,
          })
        }
      />
    </label>
  );

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold mb-6">Contact & site settings</h1>
      {message && <p className="text-sm text-accent mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-xl">
        <h2 className="font-semibold">Brand</h2>
        {field('name', 'Store name')}
        {field('tagline', 'Tagline')}
        {field('address', 'Address line')}

        <h2 className="font-semibold pt-4">Contact</h2>
        {field('phone', 'Phone (display)')}
        {field('email', 'Email')}
        {field('whatsappDisplay', 'WhatsApp (display)')}
        {field('whatsapp', 'WhatsApp number (digits only, e.g. 923482232129)')}
        {field('deliveryFee', 'Delivery fee (PKR)', 'number')}

        <h2 className="font-semibold pt-4">Social</h2>
        {field('instagram', 'Instagram URL')}
        {field('facebook', 'Facebook URL')}

        <h2 className="font-semibold pt-4">Homepage hero</h2>
        {field('heroVideo', 'Hero video URL')}
        {field('heroPoster', 'Hero poster image path')}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
