import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheck, FaEnvelope, FaPhone, FaRulerCombined, FaStar, FaUsers } from 'react-icons/fa';
import { roomAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import './RoomsPage.css';
import BookRoomModal from '../components/BookRoomModal';

const RoomsPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ show: false, message: '', error: false });

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getAllRooms();
      
      // Transform API data to match your frontend format
      const transformedRooms = response.data.map(room => ({
        id: room._id,
        name: room.type,
        type: room.type.toLowerCase().replace(' ', ''),
        price: room.price,
        image: `/assets/Rooms/${room.type} 1.jpg`,
        features: ['Free WiFi', 'AC', 'TV', 'Private Bathroom'],
        description: room.description,
        maxGuests: 2,
        size: '35 sqm',
        amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Room Service', 'Daily Housekeeping'],
        number: room.number,
        status: room.status
      }));
      
      setRooms(transformedRooms);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error fetching rooms:', err);
      
      // Fallback to static data if API fails
      setRooms([
        {
          id: 1,
          name: 'Single Room',
          type: 'single',
          price: 8000,
          image: '/assets/Rooms/Single Room 1.jpg',
          features: ['Free WiFi', 'AC', 'TV', 'Private Bathroom'],
          description: 'Perfect for solo travelers with all essential amenities.',
          maxGuests: 1,
          size: '20 sqm',
          amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Room Service', 'Daily Housekeeping']
        },
        {
          id: 2,
          name: 'Deluxe Room',
          type: 'deluxe',
          price: 12000,
          image: '/assets/Rooms/Delux Room 1.jpg',
          features: ['Bed', 'Chair', 'Mini Fridge', 'Electric Kettle', 'WiFi', 'Hot Water', 'Electric Ceiling Fan', 'Attach Bath'],
          description: 'Perfect room with all necessary needs, bed, chair, mini fridge, electric kettle, WiFi, hot water, electric ceiling fan and attach bath.',
          maxGuests: 2,
          size: '35 sqm',
          amenities: ['Comfortable Bed', 'Seating Chair', 'Mini Fridge', 'Electric Kettle', 'Free WiFi', 'Hot Water', 'Electric Ceiling Fan', 'Attached Bathroom']
        },
        {
          id: 3,
          name: 'Master Bedroom Suite',
          type: 'master',
          price: 10000,
          image: '/assets/Rooms/Master Room 1.jpg',
          features: ['Free WiFi', 'AC', 'Smart TV', 'Jacuzzi', 'Balcony', 'Room Service'],
          description: 'Luxurious suite with separate living area and premium facilities.',
          maxGuests: 2,
          size: '60 sqm',
          amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Jacuzzi', 'Private Balcony', '24/7 Room Service', 'Living Area', 'Premium Amenities']
        },
        {
          id: 4,
          name: 'Family Room',
          type: 'family',
          price: 11000,
          image: '/assets/Rooms/Family room 1.jpg',
          features: ['Bed', 'Chair', 'Mini Fridge', 'Electric Kettle', 'WiFi', 'Ceiling Fan', 'Hot Water', 'Attach Bath'],
          description: 'Perfect room with all necessary needs, bed chair, mini fridge, electric kettle, WiFi, ceiling fan, hot water and attach bath.',
          maxGuests: 3,
          size: '45 sqm',
          amenities: ['Comfortable Beds', 'Seating Chair', 'Mini Fridge', 'Electric Kettle', 'Free WiFi', 'Ceiling Fan', 'Hot Water', 'Attached Bathroom']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    // Get form data
    const form = e.target;
    const guestName = form[0].value;
    const email = form[1].value;
    const phone = form[2].value;
    const checkIn = form[3].value;
    const checkOut = form[4].value;
    const guests = form[5].value;
    const specialRequests = form[6].value;
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (!token || userType !== 'user') {
      setShowBookingModal(false);
      setFeedback({ show: true, message: 'Please login to make a booking.', error: true });
      setTimeout(() => {
        localStorage.setItem('redirectAfterLogin', '/rooms');
        window.location.href = '/login';
      }, 1500);
      return;
    }
    try {
      const response = await bookingAPI.createBooking({
        room: selectedRoom.id,
        checkIn,
        checkOut,
        guests: parseInt(guests) || 1,
        customerInfo: {
          name: guestName,
          email,
          phone,
          specialRequests: specialRequests || ''
        }
      });
      if (response.data && response.data.booking) {
        setShowBookingModal(false);
        setFeedback({ show: true, message: `🎉 Booking request submitted successfully!\n\nBooking ID: ${response.data.booking._id}\n\nYour booking is pending admin approval. You will receive confirmation within 24 hours.\n\nCheck "My Bookings" to track status.`, error: false });
        setTimeout(() => {
          setFeedback({ show: false, message: '', error: false });
          navigate('/booking');
        }, 3000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setShowBookingModal(false);
      setFeedback({ show: true, message: `❌ Booking failed: ${error.response?.data?.message || error.message || 'Please try again'}`, error: true });
      setTimeout(() => setFeedback({ show: false, message: '', error: false }), 3000);
    }
  };

  return (
    <div className="rooms-page">
      {/* Hero Section */}
      <section className="rooms-hero">
        <div className="container">
          <div className="rooms-hero-content">
            <h1 className="rooms-hero-title">Our Rooms</h1>
            <p className="rooms-hero-description">
              Choose from our carefully designed rooms, each equipped with all necessary amenities for a comfortable and memorable stay at Yasin Heaven Star Hotel.
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="rooms-section">
        <div className="container">
          {loading ? (
            <div className="loading-container" style={{textAlign: 'center', padding: '2rem'}}>
              <p>Loading rooms...</p>
            </div>
          ) : error ? (
            <div className="error-container" style={{textAlign: 'center', padding: '2rem', color: 'red'}}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-image">
                  <img src={room.image} alt={room.name} />
                  <div className="room-price-badge">
                    <span className="room-price">PKR {room.price}</span>
                    <span className="room-price-period">/night</span>
                  </div>
                </div>
                
                <div className="room-content">
                  <div className="room-header">
                    <h3 className="room-name">{room.name}</h3>
                    <div className="room-rating">
                      <FaStar className="star-icon" />
                      <span>4.8</span>
                    </div>
                  </div>
                  
                  <p className="room-description">{room.description}</p>
                  
                  <div className="room-details">
                    <div className="room-detail">
                      <FaUsers className="detail-icon" />
                      <span>Up to {room.maxGuests} guests</span>
                    </div>
                    <div className="room-detail">
                      <FaRulerCombined className="detail-icon" />
                      <span>{room.size}</span>
                    </div>
                  </div>
                  
                  <div className="room-amenities">
                    <h4>Amenities:</h4>
                    <ul className="amenities-list">
                      {room.amenities.map((amenity, index) => (
                        <li key={index} className="amenity-item">
                          <FaCheck className="check-icon" />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="room-actions">
                    <button 
                      className="btn btn-primary room-book-btn"
                      onClick={() => handleBookRoom(room)}
                    >
                      Book Now
                      <FaArrowRight className="btn-arrow" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookRoomModal
          selectedRoom={selectedRoom}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => {
            setShowBookingModal(false);
            setFeedback({ show: true, message: '🎉 Booking request submitted successfully!\n\nYour booking is pending admin approval. You will receive confirmation within 24 hours.\n\nCheck "My Bookings" to track status.', error: false });
            setTimeout(() => {
              setFeedback({ show: false, message: '', error: false });
              navigate('/booking');
            }, 3000);
          }}
        />
      )}
      {/* Feedback Toast/Modal */}
      {feedback.show && (
        <div className={`booking-feedback-toast${feedback.error ? ' error' : ''}`} style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: feedback.error ? '#f87171' : '#4ade80', color: '#fff', padding: '16px 24px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <span style={{ whiteSpace: 'pre-line' }}>{feedback.message}</span>
        </div>
      )}

      {/* Contact Section */}
      <section className="rooms-contact">
        <div className="container">
          <div className="contact-content">
            <h2>Need Help Choosing?</h2>
            <p>Our team is here to help you find the perfect room for your stay.</p>
            <div className="contact-actions">
              <a href="tel:+1234567890" className="contact-btn">
                <FaPhone />
                Call Us
              </a>
              <a href="mailto:info@yasinheavenstar.com" className="contact-btn">
                <FaEnvelope />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomsPage;
