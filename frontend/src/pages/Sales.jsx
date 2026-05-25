import { useEffect, useState } from 'react';
import { productsApi, salesApi } from '../api/services';
import './Pages.css';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        salesApi.getAll(),
        productsApi.getAll(),
      ]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
    } catch {
      setError('Failed to load sales.');
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await salesApi.create({
        productId: parseInt(productId, 10),
        quantity: parseInt(quantity, 10),
      });
      setProductId('');
      setQuantity('1');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Sale failed. Check stock.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete sale and restore stock?')) return;
    await salesApi.remove(id);
    load();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Sales</h2>
        <p>Record sales — stock updates automatically.</p>
      </header>

      {error && <p className="error-text">{error}</p>}

      <form className="panel" onSubmit={handleCreate}>
        <h3>New Sale</h3>
        <div className="form-grid">
          <label>
            Product
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.quantity})
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </label>
        </div>
        <button type="submit" className="primary">Record Sale</button>
      </form>

      <section className="panel">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>${s.totalPrice.toFixed(2)}</td>
                <td>{new Date(s.saleDate).toLocaleString()}</td>
                <td>
                  <button type="button" className="danger" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
