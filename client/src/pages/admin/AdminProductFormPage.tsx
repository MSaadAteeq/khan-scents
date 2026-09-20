import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminCreateProduct, adminGetProducts, adminUpdateProduct, adminUploadProductImage } from '../../lib/api';
import type { Gender, Note, Product } from '../../types/product';

const GENDERS: Gender[] = ['him', 'her', 'unisex'];
const NOTES: Note[] = ['fresh', 'woody', 'sweet', 'long-lasting'];

const empty: Partial<Product> = {
  name: '',
  slug: '',
  inspiredBy: '',
  size: '50 mL / 1.7 FL. OZ.',
  price: 2499,
  gender: 'unisex',
  notes: [],
  longevity: '',
  howToUse: '',
  images: [],
  bestSeller: false,
  description: '',
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Partial<Product>>(empty);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    adminGetProducts()
      .then((products) => {
        const product = products.find((p) => p.id === id);
        if (!product) throw new Error('Product not found');
        setForm(product);
        setImages(product.images ?? []);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const toggleNote = (note: Note) => {
    const notes = form.notes ?? [];
    setForm({
      ...form,
      notes: notes.includes(note) ? notes.filter((n) => n !== note) : [...notes, note],
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(fileList)) {
        const { url } = await adminUploadProductImage(file);
        uploaded.push(url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Add at least one product photo');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      images,
    };
    try {
      if (isNew) {
        await adminCreateProduct(payload);
      } else {
        await adminUpdateProduct(id!, payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-text-muted">Loading…</p>;

  return (
    <div>
      <Link to="/admin/products" className="text-sm text-accent hover:underline mb-4 inline-block">
        ← Back to products
      </Link>
      <h1 className="font-heading text-3xl font-semibold mb-6">{isNew ? 'Add product' : 'Edit product'}</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm sm:col-span-2">
            <span className="text-text-muted mb-1 block">Name *</span>
            <input className="input-field" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Slug</span>
            <input className="input-field" value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Inspired by</span>
            <input className="input-field" value={form.inspiredBy ?? ''} onChange={(e) => setForm({ ...form, inspiredBy: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Price (PKR)</span>
            <input type="number" className="input-field" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Size</span>
            <input className="input-field" value={form.size ?? ''} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Gender</span>
            <select className="input-field" value={form.gender ?? 'unisex'} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-text-muted mb-1 block">Longevity</span>
            <input className="input-field" value={form.longevity ?? ''} onChange={(e) => setForm({ ...form, longevity: e.target.value })} />
          </label>
        </div>

        <div>
          <span className="text-sm text-text-muted mb-2 block">Notes</span>
          <div className="flex flex-wrap gap-2">
            {NOTES.map((note) => (
              <button
                key={note}
                type="button"
                onClick={() => toggleNote(note)}
                className={`px-3 py-1 rounded-full text-xs border ${
                  form.notes?.includes(note) ? 'bg-accent text-white border-accent' : 'border-border text-text-muted'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.bestSeller ?? false} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} />
          Best seller (show on homepage)
        </label>

        <label className="block text-sm">
          <span className="text-text-muted mb-1 block">Description</span>
          <textarea className="input-field min-h-24" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <label className="block text-sm">
          <span className="text-text-muted mb-1 block">How to use</span>
          <textarea className="input-field min-h-20" value={form.howToUse ?? ''} onChange={(e) => setForm({ ...form, howToUse: e.target.value })} />
        </label>

        <div className="space-y-3">
          <span className="text-sm text-text-muted block">Product photos *</span>
          <p className="text-xs text-text-muted">
            Images are stored on Cloudinary. The database only keeps the public image links.
          </p>
          {images.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {images.map((url, index) => (
                <li key={`${url}-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-surface">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs leading-none"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">Main</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="text-sm"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
            {uploading && <span className="text-sm text-text-muted">Uploading…</span>}
          </div>
          <p className="text-xs text-text-muted">First photo is the shop thumbnail. Upload again to replace — remove old photos you no longer need.</p>
        </div>

        <button type="submit" className="btn-primary" disabled={saving || uploading}>
          {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
