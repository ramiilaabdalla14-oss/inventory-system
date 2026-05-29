import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const NAV = [
  { to: '/', end: true, label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/sales', label: 'Sales', icon: '💰' },
  { to: '/users', label: 'Users', icon: '👥', adminOnly: true },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div className="app-shell">
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon-wrap">📦</div>
          <div>
            <h1>Inventory Pro</h1>
            <p>Management System</p>
          </div>
        </div>

        <nav onClick={() => setMenuOpen(false)}>
          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="user-box">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span className="role-badge">{user?.role}</span>
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
