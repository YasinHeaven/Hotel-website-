import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('/api/users', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    });
    setUsers(await res.json());
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error saving user');
      setForm({ name: '', email: '', password: '' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to save user');
    }
  };

  const handleEdit = user => {
    setForm({ name: user.name, email: user.email, password: '' });
    setEditingId(user._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    });
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <h3 className="admin-users-title">Manage Users</h3>
        <form className="admin-users-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required={!editingId} />
          <button className="admin-users-btn" type="submit">{editingId ? 'Update' : 'Add'} User</button>
          {error && <span className="error">{error}</span>}
        </form>
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="admin-users-action-btn" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="admin-users-action-btn delete" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 