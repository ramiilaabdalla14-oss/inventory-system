import { useEffect, useState } from 'react';
import { usersApi } from '../api/services';
import './Pages.css';

const emptyForm = { name: '', email: '', password: '', role: 'Staff' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    usersApi.getAll()
      .then((res) => setUsers(res.data))
      .catch(() => setError('Failed to load users.'));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await usersApi.update(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password || null,
        });
      } else {
        await usersApi.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete user?')) return;
    await usersApi.remove(id);
    load();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Users</h2>
        <p>Admin only — manage system users.</p>
      </header>

      {error && <p className="error-text">{error}</p>}

      <form className="panel" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit User' : 'Add User'}</h3>
        <div className="form-grid">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password {editingId && '(leave blank to keep)'}
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
        <div className="btn-row">
          <button type="submit" className="primary">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
          )}
        </div>
      </form>

      <section className="panel">
        <div className="panel-header">
          <h3>All Users</h3>
          <span className="panel-badge">{users.length} users</span>
        </div>
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="role-badge">{u.role}</span></td>
                <td className="btn-row">
                  <button type="button" className="secondary" onClick={() => handleEdit(u)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
