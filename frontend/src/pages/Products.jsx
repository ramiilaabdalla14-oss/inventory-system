import { useEffect, useState } from 'react';
import { productsApi } from '../api/services';
import FileUpload from '../components/FileUpload';
import './Pages.css';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  imageUrl: '',
  documentUrl: '',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    productsApi.getAll()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products.'));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      imageUrl: form.imageUrl || null,
      documentUrl: form.documentUrl || null,
    };

    try {
      if (editingId) {
        await productsApi.update(editingId, payload);
      } else {
        await productsApi.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch {
      setError('Save failed.');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      quantity: String(p.quantity),
      imageUrl: p.imageUrl || '',
      documentUrl: p.documentUrl || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await productsApi.remove(id);
    load();
  };

  return (
    <div className="page">
      <header className="page-toolbar">
        <div>
          <h2>Products</h2>
          <p>Manage inventory. Images/documents stored on Cloudinary (URL only in DB).</p>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      <form className="panel" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <div className="form-grid">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Price
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </label>
          <label>
            Quantity
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          </label>
          <label className="full-width">
            Description
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
        </div>
        <div className="form-grid">
          <FileUpload
            label="Product Image (Cloudinary)"
            folder="inventory/images"
            accept="image/*"
            onUploaded={(url) => setForm({ ...form, imageUrl: url })}
          />
          {form.imageUrl && <small>Image URL set ✓</small>}
          <FileUpload
            label="Document (Cloudinary)"
            folder="inventory/documents"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            onUploaded={(url) => setForm({ ...form, documentUrl: url })}
          />
          {form.documentUrl && <small>Document URL set ✓</small>}
        </div>
        <div className="btn-row">
          <button type="submit" className="primary">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Doc</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="thumb" /> : '—'}
                </td>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  {p.documentUrl ? (
                    <a href={p.documentUrl} target="_blank" rel="noreferrer">View</a>
                  ) : '—'}
                </td>
                <td className="btn-row">
                  <button type="button" className="secondary" onClick={() => handleEdit(p)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
