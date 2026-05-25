import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/services';
import './Pages.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard.'));
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="page">
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your inventory system</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Products</span>
          <strong>{stats.totalProducts}</strong>
        </div>
        <div className="stat-card">
          <span>Total Sales</span>
          <strong>{stats.totalSales}</strong>
        </div>
        <div className="stat-card warning">
          <span>Low Stock (≤5)</span>
          <strong>{stats.lowStockCount}</strong>
        </div>
        <div className="stat-card">
          <span>Total Revenue</span>
          <strong>${stats.totalRevenue.toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <span>Revenue Today</span>
          <strong>${stats.revenueToday.toFixed(2)}</strong>
        </div>
      </div>

      <section className="panel">
        <h3>Recent Sales</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentSales.map((s) => (
              <tr key={s.id}>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>${s.totalPrice.toFixed(2)}</td>
                <td>{new Date(s.saleDate).toLocaleString()}</td>
              </tr>
            ))}
            {stats.recentSales.length === 0 && (
              <tr><td colSpan={4}>No sales yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
