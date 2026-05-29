import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const STAT_CARDS = [
  { key: 'totalProducts', label: 'Total Products', icon: '📦', variant: 'blue', format: (v) => v },
  { key: 'totalSales', label: 'Total Sales', icon: '🛒', variant: 'green', format: (v) => v },
  { key: 'lowStockCount', label: 'Low Stock (≤5)', icon: '⚠️', variant: 'amber', format: (v) => v },
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💵', variant: 'violet', format: (v) => `$${v.toFixed(2)}` },
  { key: 'revenueToday', label: 'Revenue Today', icon: '📈', variant: 'cyan', format: (v) => `$${v.toFixed(2)}` },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [slowLoad, setSlowLoad] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const loadStats = async (attempt = 1) => {
    try {
      const { data } = await dashboardApi.getStats();
      setStats(data);
      setError('');
    } catch {
      if (attempt < 4) {
        setRetrying(true);
        await new Promise((r) => setTimeout(r, 8000));
        return loadStats(attempt + 1);
      }
      setError(
        'Server-ka ma jawaabayo. Render (free) wuxuu qaadan karaa 1 daqiiqo marka la toosiyo. Refresh ama sug kadib isku day mar kale.'
      );
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setSlowLoad(true), 5000);
    loadStats();
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
        <button type="button" className="primary" style={{ marginTop: '1rem' }} onClick={() => { setError(''); setStats(null); loadStats(); }}>
          Try again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>{retrying ? 'Retrying connection…' : 'Loading dashboard…'}</span>
        {slowLoad && (
          <p className="loading-hint">
            Render API wuu hurdaa (free tier). Sug 30–60 ilbiriqsi…
          </p>
        )}
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="page-greeting">{greeting}, {user?.name} 👋</p>
          <h2>Dashboard</h2>
          <p>Overview of your inventory system</p>
        </div>
      </header>

      <div className="stats-grid">
        {STAT_CARDS.map(({ key, label, icon, variant, format }) => (
          <div key={key} className={`stat-card stat-card--${variant}`}>
            <div className="stat-card__top">
              <span className="stat-card__label">{label}</span>
              <span className="stat-card__icon">{icon}</span>
            </div>
            <strong className="stat-card__value">{format(stats[key])}</strong>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Recent Sales</h3>
          <span className="panel-badge">{stats.recentSales.length} records</span>
        </div>
        <div className="table-wrap">
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
                  <td><span className="table-product">{s.productName}</span></td>
                  <td><span className="qty-badge">{s.quantity}</span></td>
                  <td className="money">${s.totalPrice.toFixed(2)}</td>
                  <td className="text-muted">{new Date(s.saleDate).toLocaleString()}</td>
                </tr>
              ))}
              {stats.recentSales.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-cell">No sales recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
