import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ number: '', type: '', price: '', status: 'available', description: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    });
    setRooms(await res.json());
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    let image = form.image;
    if (name === 'type') {
      // Set image path based on type
      if (value === 'Delux Room') image = '/assets/Delux Room 1.jpg';
      else if (value === 'Master Room') image = '/assets/Master Room.jpg';
      else if (value === 'Family Room') image = '/assets/Family room 1.jpg';
      else if (value === 'Single Room') image = '/assets/Single Room.jpg';
      else image = '';
    }
    setForm({ ...form, [name]: value, image });
  };

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
      setForm({ number: '', type: '', price: '', status: 'available', description: '', image: '' });
      setEditingId(null);
      fetchRooms();
    } catch (err) {
      setError('Failed to save room');
    }
  };

  const handleEdit = room => {
    setForm({
      number: room.number,
      type: room.type,
      price: room.price,
      status: room.status,
      description: room.description,
      image: room.image || ''
    });
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
      <div className="admin-rooms-container">
        <h3 className="admin-rooms-title">Manage Rooms</h3>
        <form className="admin-rooms-form" onSubmit={handleSubmit}>
          <input name="number" placeholder="Number" value={form.number} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Delux Room">Delux Room</option>
            <option value="Master Room">Master Room</option>
            <option value="Family Room">Family Room</option>
            <option value="Single Room">Single Room</option>
          </select>
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <button className="admin-rooms-btn" type="submit">{editingId ? 'Update' : 'Add'} Room</button>
          {error && <span className="error">{error}</span>}
        </form>
        <table className="admin-rooms-table">
          <thead>
            <tr>
              <th>Image</th><th>Number</th><th>Type</th><th>Price</th><th>Status</th><th>Description</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>
                  {room.image ? (
                    <img src={room.image} alt={room.type} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                  ) : (
                    <span style={{ color: '#ccc' }}>No Image</span>
                  )}
                </td>
                <td>{room.number}</td>
                <td>{room.type}</td>
                <td>{room.price} PKR</td>
                <td>{room.status}</td>
                <td>{room.description}</td>
                <td>
                  <button className="admin-rooms-action-btn" onClick={() => handleEdit(room)}>Edit</button>
                  <button className="admin-rooms-action-btn delete" onClick={() => handleDelete(room._id)}>Delete</button>
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