import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminDeleteProduct, adminGetProducts } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import type { Product } from '../../types/product';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminGetProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await adminDeleteProduct(product.id);
    load();
  };

  if (loading) return <p className="text-text-muted">Loading products…</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-3xl font-semibold">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          Add product
        </Link>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-left text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Gender</th>
                <th className="px-4 py-3 font-medium">Best seller</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <span className="font-medium">{p.name}</span>
                    <span className="block text-text-muted text-xs">{p.slug}</span>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 capitalize">{p.gender}</td>
                  <td className="px-4 py-3">{p.bestSeller ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/products/${p.id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                    <button type="button" onClick={() => handleDelete(p)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
