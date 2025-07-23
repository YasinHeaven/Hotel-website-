import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ number: '', type: '', price: '', status: 'available', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    });
    setRooms(await res.json());
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/rooms/${editingId}` : '/api/rooms';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('adminToken')
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error saving room');
      setForm({ number: '', type: '', price: '', status: 'available', description: '' });
      setEditingId(null);
      fetchRooms();
    } catch (err) {
      setError('Failed to save room');
    }
  };

  const handleEdit = room => {
    setForm(room);
    setEditingId(room._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this room?')) return;
    await fetch(`/api/rooms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    });
    fetchRooms();
  };

  return (
    <AdminLayout>
      <div>
        <h3>Manage Rooms</h3>
        <form onSubmit={handleSubmit}>
          <input name="number" placeholder="Number" value={form.number} onChange={handleChange} required />
          <input name="type" placeholder="Type" value={form.type} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <button type="submit">{editingId ? 'Update' : 'Add'} Room</button>
          {error && <span className="error">{error}</span>}
        </form>
        <table>
          <thead>
            <tr>
              <th>Number</th><th>Type</th><th>Price</th><th>Status</th><th>Description</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>{room.number}</td>
                <td>{room.type}</td>
                <td>{room.price}</td>
                <td>{room.status}</td>
                <td>{room.description}</td>
                <td>
                  <button onClick={() => handleEdit(room)}>Edit</button>
                  <button onClick={() => handleDelete(room._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms; 