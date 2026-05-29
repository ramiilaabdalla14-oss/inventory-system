import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login(email, password);
      login(data);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Please try again in a moment.');
      } else if (err.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(`Something went wrong (${err.response.status}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero__content">
          <div className="login-hero__badge">Inventory Pro</div>
          <h1>Manage your stock with confidence</h1>
          <p>
            Track products, record sales, and monitor inventory — all in one
            modern dashboard built for your business.
          </p>
          <ul className="login-hero__features">
            <li>Real-time stock tracking</li>
            <li>Sales & revenue analytics</li>
            <li>Multi-user access control</li>
          </ul>
        </div>
        <div className="login-hero__glow" aria-hidden="true" />
      </div>

      <div className="login-form-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card__header">
            <span className="login-card__logo">📦</span>
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="alert" role="alert">{error}</div>}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="login-demo">
            <span>Demo access</span>
            <code>admin@inventory.com</code>
            <code>Admin@123</code>
          </div>
        </form>
      </div>
    </div>
  );
}
