import { useState, useEffect } from 'react';
import { FaArrowRight, FaBed, FaCalendarAlt, FaCar, FaCheckCircle, FaCoffee, FaConciergeBell, FaMapMarkerAlt, FaRoute, FaSearch, FaShoppingBag, FaShower, FaSpa, FaStar, FaUmbrellaBeach, FaUsers, FaUtensils, FaWifi, FaWineGlass } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import './HomePage.css';
import BookRoomModal from '../components/BookRoomModal';
import { roomAPI } from '../services/api';

// Move facilities array definition to the top, before any useState calls
const facilities = [
  {
    icon: <FaCar />, // Parking
    name: 'Safe & Secure Parking',
    description: 'We offer dedicated parking space for up to 50 vehicles so you never have to worry about finding a spot. Our main parking area is conveniently located right next to the hotel’s front gate, while space for larger vehicles is just a short walk away. Whether you\'re arriving by car, van, or tour bus, your ride is safe with us.',
    images: [
      '/assets/facilities/Parking/Parking 1.jpg',
      '/assets/facilities/Parking/Parking 2.jpg',
      '/assets/facilities/Parking/Parking 3.jpg',
    ],
  },
  {
    icon: <FaWifi />, // Wi-Fi
    name: 'Fast & Reliable Wi-Fi',
    description: 'Stay connected with our high-speed internet available 24/7 throughout the hotel. Whether you\'re working, video calling loved ones, or streaming your favorite shows we’ve got you covered with smooth, uninterrupted access.',
    images: [],
  },
  {
    icon: <FaShoppingBag />, // Gift Shop
    name: 'Charming Gift Shop',
    description: 'Take a piece of Yasin home with you! Our gift shop offers a delightful selection of local crafts, souvenirs, and travel essentials. Whether you\'re picking up a keepsake or finding the perfect gift, you’ll discover something unique to remember your stay by. And for a touch of color, visit our Bouquet Corner.',
    images: [
      '/assets/Home 1.jpg', // Placeholder until gift shop image is available
    ],
  },
  {
    icon: <FaStar />, // Power Supply
    name: 'Uninterrupted Power Supply',
    description: 'Enjoy round-the-clock electricity during your stay! Due to the location of main powerhouse in Yasin Ghizer, our hotel provides reliable 24/7 lighting so you\'re never left in the dark, whether it’s for work, relaxation, or planning your next adventure.',
    images: [],
  },
  {
    icon: <FaShower />, // Water/Showers
    name: 'Refreshing Glacier Water & Soothing Hot Showers',
    description: 'At Yasin Heaven Star Hotel, every room is equipped with both hot and cold water, perfect for unwinding after a day of adventure. Our cold water flows fresh from nearby glacier-fed sources, offering a crisp and rejuvenating experience, while our hot water is always ready to warm you up in comfort.',
    images: [],
  },
  {
    icon: <FaCheckCircle />, // Security
    name: '24/7 Security',
    description: 'Your Safety Comes First.  At Yasin Heaven Star Hotel, we prioritize your peace of mind. Our premises are safe and secure, with attentive staff and protective measures in place 24/7 so you can relax, explore, and enjoy your stay without worry.',
    images: [
      '/assets/Home 2.jpg', // Placeholder until security image is available
    ],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: 'standard'
  });

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [facilityImgIndexes, setFacilityImgIndexes] = useState(() => facilities.map(() => 0));
  const [bookingLoading, setBookingLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  // Fetch rooms from API (like RoomsPage)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await roomAPI.getAllRooms();
        // Transform API data to match frontend format
        const transformedRooms = response.data.map(room => ({
          id: room._id,
          name: room.type,
          type: room.type.toLowerCase().replace(' ', ''),
          price: room.price,
          image: `/assets/Rooms/${room.type} 1.jpg`,
          features: ['Free WiFi', 'AC', 'TV', 'Private Bathroom'],
          description: room.description,
          maxGuests: room.capacity || 2,
          size: '35 sqm',
          amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom', 'Room Service', 'Daily Housekeeping'],
          number: room.number,
          status: room.status
        }));
        setRooms(transformedRooms);
        setError('');
      } catch (err) {
        setError('Failed to load rooms');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search data:', searchData);
    // Implement search logic here
  };

  const handleRoomBooking = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    setBookingLoading(true);
    console.log('Booking submitted:', bookingData);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'user') {
      setSnackbar({ 
        open: true, 
        message: '🔐 Please login to make a booking', 
        severity: 'warning' 
      });
      localStorage.setItem('redirectAfterLogin', '/');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      setBookingLoading(false);
      return;
    }

    try {
      // Import the booking API
      const { bookingAPI } = await import('../services/api');
      
      // Build booking payload to match backend expectations
      const payload = {
        room: bookingData.id || bookingData._id || bookingData, // handle both object and id
        checkIn: bookingData.checkIn || bookingData.checkInDate,
        checkOut: bookingData.checkOut || bookingData.checkOutDate,
        guests: parseInt(bookingData.guests) || 1,
        customerInfo: {
          name: bookingData.guestName,
          email: bookingData.email,
          phone: bookingData.phone,
          specialRequests: bookingData.specialRequests || ''
        }
      };
      
      const response = await bookingAPI.createBooking(payload);
      setBookingLoading(false);

      if (response.data && response.data.booking) {
        const booking = response.data.booking;
        const bookingId = booking._id;
        
        // Show success notification
        setSnackbar({ 
          open: true, 
          message: `🎉 Booking request submitted! ID: ${bookingId}`, 
          severity: 'success' 
        });
        
        // Set booking success data for confirmation display
        setBookingSuccess({
          booking: booking,
          room: selectedRoom,
          bookingData: bookingData,
          nextSteps: response.data.nextSteps || [
            'Admin will review within 24 hours',
            'You\'ll receive email confirmation',
            'Check "My Bookings" for updates'
          ]
        });
        
        // Close modal and show confirmation
        setShowBookingModal(false);
        setShowBookingConfirmation(true);
        
        // Auto-redirect after 8 seconds
        setTimeout(() => {
          navigate('/booking');
        }, 8000);
        
      } else {
        setSnackbar({ 
          open: true, 
          message: '❌ Booking failed. Please try again.', 
          severity: 'error' 
        });
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setBookingLoading(false);
      console.error('Booking error:', error);
      setSnackbar({ 
        open: true, 
        message: `❌ Booking failed: ${error.response?.data?.message || error.message || 'Please try again'}`, 
        severity: 'error' 
      });
    }
  };

  // Updated functions for button interactions using React Router
  const handleExploreDestination = (destinationType) => {
    switch (destinationType) {
      case 'Beach':
        navigate('/destinations/beach');
        break;
      case 'City':
        navigate('/destinations/city');
        break;
      case 'Mountain':
        navigate('/destinations/mountain');
        break;
      default:
        navigate('/rooms');
    }
  };

  const handleViewRoomDetails = (room) => {
    alert(`${room.name} Details:\n\nSize: ${room.size}\nCapacity: Up to ${room.maxGuests} guests\nPrice: PKR ${room.price}/night\n\nFeatures:\n${room.features.join(', ')}\n\n${room.description}`);
  };

  const handleRestaurantReservation = () => {
    navigate('/restaurant');
  };

  const handleViewFullMenu = () => {
    navigate('/restaurant');
  };

  const handleExploreFacilities = () => {
    navigate('/facilities');
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      setSnackbar({ 
        open: true, 
        message: `📧 Thank you for subscribing! You'll receive exclusive deals at ${email}`, 
        severity: 'success' 
      });
      e.target.reset();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseBookingConfirmation = () => {
    setShowBookingConfirmation(false);
    setBookingSuccess(null);
  };

  const handlePrevImg = (facilityIdx, totalImgs) => {
    setFacilityImgIndexes(prev => {
      const updated = [...prev];
      updated[facilityIdx] = (updated[facilityIdx] - 1 + totalImgs) % totalImgs;
      return updated;
    });
  };

  const handleNextImg = (facilityIdx, totalImgs) => {
    setFacilityImgIndexes(prev => {
      const updated = [...prev];
      updated[facilityIdx] = (updated[facilityIdx] + 1) % totalImgs;
      return updated;
    });
  };

  const restaurantMenu = [
    {
      category: 'Breakfast',
      items: [
        { name: 'Continental Breakfast', price: 25, description: 'Fresh pastries, fruits, coffee, and juice' },
        { name: 'Full English Breakfast', price: 35, description: 'Eggs, bacon, sausages, beans, toast, and coffee' },
        { name: 'Healthy Bowl', price: 28, description: 'Granola, yogurt, fresh berries, and honey' }
      ]
    },
    {
      category: 'Lunch & Dinner',
      items: [
        { name: 'Grilled Salmon', price: 45, description: 'Fresh Atlantic salmon with vegetables' },
        { name: 'Beef Tenderloin', price: 55, description: 'Premium cut with truffle sauce' },
        { name: 'Vegetarian Pasta', price: 32, description: 'Fresh pasta with seasonal vegetables' },
        { name: 'Chef\'s Special', price: 48, description: 'Daily special created by our head chef' }
      ]
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-gradient-overlay"></div>
        
        {/* Animated background elements */}
        <div className="hero-bg-element hero-bg-1"></div>
        <div className="hero-bg-element hero-bg-2"></div>
        
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <div className="hero-badge">
                ⭐ Premium Hotel Experience
              </div>
              
              <h1 className="hero-title">
                Welcome to <span className="hero-title-gradient">Yasin Heaven Star Hotel</span>
                <br />
                <span className="hero-subtitle">Premium Hospitality Experience</span>
              </h1>
              
              <p className="hero-description">
                Discover luxury hotels and unforgettable experiences worldwide. Your perfect stay awaits.
              </p>
              
              {/* Enhanced Search Card */}
              <div className="search-card">
                <div className="search-card-content">
                  <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-field">
                      <label htmlFor="destination" className="search-label">
                        <FaMapMarkerAlt className="search-icon" />
                        Destination
                      </label>
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        placeholder="Where are you going?"
                        value={searchData.destination}
                        onChange={handleInputChange}
                        className="search-input"
                        required
                      />
                    </div>
                    
                    <div className="search-field">
                      <label htmlFor="checkIn" className="search-label">
                        <FaCalendarAlt className="search-icon" />
                        Check-in
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        name="checkIn"
                        value={searchData.checkIn}
                        onChange={handleInputChange}
                        className="search-input"
                        required
                      />
                    </div>
                    
                    <div className="search-field">
                      <label htmlFor="checkOut" className="search-label">
                        <FaCalendarAlt className="search-icon" />
                        Check-out
                      </label>
                      <input
                        type="date"
                        id="checkOut"
                        name="checkOut"
                        value={searchData.checkOut}
                        onChange={handleInputChange}
                        className="search-input"
                        required
                      />
                    </div>
                    
                    <div className="search-field">
                      <label htmlFor="guests" className="search-label">
                        <FaUsers className="search-icon" />
                        Guests
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={searchData.guests}
                        onChange={handleInputChange}
                        className="search-select"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5+">5+ Guests</option>
                      </select>
                    </div>
                    
                    <div className="search-field">
                      <label htmlFor="roomType" className="search-label">
                        <FaBed className="search-icon" />
                        Room Type
                      </label>
                      <select
                        id="roomType"
                        name="roomType"
                        value={searchData.roomType}
                        onChange={handleInputChange}
                        className="search-select"
                      >
                        <option value="single">Single Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="master">Master Suite</option>
                        <option value="family">Family Room</option>
                      </select>
                    </div>
                    
                    <div className="search-button-container">
                      <button type="submit" className="search-button">
                        <FaSearch className="search-btn-icon" />
                        Search Hotels
                        <FaArrowRight className="search-btn-arrow" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <div className="about-content">
            <div className="section-header">
              <div className="section-badge">
                About Us
              </div>
              <h2 className="section-title">Yasin Heaven Star Hotel</h2>
            </div>
            
            <div className="about-text">
              <p className="about-description">
                Welcome to Yasin Heaven Star Hotel, a peaceful getaway nestled in the scenic Ghizer Yasin district of Gilgit Baltistan. Since opening in June 2022, our cozy hotel has been offering guests a comfortable stay with 10 well-furnished rooms, each with a private bathroom, and top-notch hospitality.<br/>
                Whether you're here for leisure or business, we’ve got everything to make your visit relaxing and enjoyable from a spacious restaurant serving your favorite meals to a fully equipped conference room for meetings and events. With free high-speed Wi-Fi, 24/7 service, and a serene garden, Yasin Heaven Star Hotel is your home away from home.
              </p>
            </div>
            
            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="about-feature-content">
                  <h4>Prime Location</h4>
                  <p>Center of Yasin Valley</p>
                </div>
              </div>
              
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaUsers />
                </div>
                <div className="about-feature-content">
                  <h4>For Everyone</h4>
                  <p>Group or Individual Travel</p>
                </div>
              </div>
              
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaStar />
                </div>
                <div className="about-feature-content">
                  <h4>All Budgets</h4>
                  <p>Small to Large Budget Options</p>
                </div>
              </div>
              
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaSpa />
                </div>
                <div className="about-feature-content">
                  <h4>Peaceful Environment</h4>
                  <p>Truly Relaxing Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="section location-section">
        <div className="container">
          <div className="location-content">
            <div className="section-header">
              <div className="section-badge">
                Our Location
              </div>
              <h2 className="section-title">Location of Yasin Heaven Star Hotel</h2>
            </div>
            
            <div className="location-main">
              <div className="location-description">
                <p className="location-text">
                  Discover the Comfort of Yasin Heaven Star Hotel, perfectly located in the heart of Yasin, just 64 km from Gahkuch (the headquarters of Ghizer Valley) and a scenic 40-minute drive from Gupis Valley.<br/>
                  Whether you’re traveling solo or with a group, on a tight budget or seeking something premium, we’ve got a cozy spot just for you. Our peaceful atmosphere and friendly service make every stay memorable so much so that guests love to come back again and again.
                </p>
              </div>
              
              <div className="location-map">
                <img src="/assets/location.jpg" alt="Yasin Heaven Star Hotel Location" className="map-image" />
              </div>
              
              <div className="location-details">
                <div className="location-detail">
                  <div className="location-detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="location-detail-content">
                    <h4>Central Yasin Location</h4>
                    <p>Located at the heart of Yasin Valley for easy access to all attractions</p>
                  </div>
                </div>
                
                <div className="location-detail">
                  <div className="location-detail-icon">
                    <FaCar />
                  </div>
                  <div className="location-detail-content">
                    <h4>64 km from Gahkuch</h4>
                    <p>Just 64 km away from Gahkuch, the headquarters of Ghizer Valley</p>
                  </div>
                </div>
                
                <div className="location-detail">
                  <div className="location-detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="location-detail-content">
                    <h4>40 min from Gupis Valley</h4>
                    <p>Convenient 40-minute drive from the beautiful Gupis Valley</p>
                  </div>
                </div>
                
                <div className="location-detail">
                  <div className="location-detail-icon">
                    <FaStar />
                  </div>
                  <div className="location-detail-content">
                    <h4>Perfect Access Point</h4>
                    <p>Ideal location for exploring the natural beauty of the region</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="section destinations-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              Explore Destinations
            </div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-description">
              From bustling cities to serene beaches, discover your perfect getaway
            </p>
          </div>
          
          <div className="destinations-grid">
            <div className="destination-card">
              <div className="destination-image">
                <img src="/assets/Home 1.jpg" alt="Beach Destinations" />
                <div className="destination-overlay">
                  <div className="destination-badge beach">🏖️ Beach</div>
                </div>
              </div>
              <div className="destination-content">
                <h3 className="destination-title">Beach Destinations</h3>
                <p className="destination-description">
                  Discover perfect hotels for your next warm-weather vacation with seaside escapes
                </p>
                <button 
                  className="btn btn-outline destination-btn"
                  onClick={() => handleExploreDestination('Beach')}
                >
                  Explore Beach Hotels
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
            
            <div className="destination-card">
              <div className="destination-image">
                <img src="/assets/Home 2.jpg" alt="City Hotels" />
                <div className="destination-overlay">
                  <div className="destination-badge city">🏙️ City</div>
                </div>
              </div>
              <div className="destination-content">
                <h3 className="destination-title">City Hotels</h3>
                <p className="destination-description">
                  Experience urban luxury with our premium city hotels in major metropolitan areas
                </p>
                <button 
                  className="btn btn-outline destination-btn"
                  onClick={() => handleExploreDestination('City')}
                >
                  Explore City Hotels
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
            
            <div className="destination-card">
              <div className="destination-image">
                <img src="/assets/home 3.jpg" alt="Mountain Resorts" />
                <div className="destination-overlay">
                  <div className="destination-badge mountain">🏔️ Mountain</div>
                </div>
              </div>
              <div className="destination-content">
                <h3 className="destination-title">Mountain Resorts</h3>
                <p className="destination-description">
                  Retreat to serene mountain resorts for the perfect blend of adventure and relaxation
                </p>
                <button 
                  className="btn btn-outline destination-btn"
                  onClick={() => handleExploreDestination('Mountain')}
                >
                  Explore Mountain Resorts
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="section rooms-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              🏨 Our Rooms
            </div>
            <h2 className="section-title">Choose Your Perfect Stay</h2>
            <p className="section-description">
              From cozy single rooms to luxurious suites, find the perfect accommodation for your needs
            </p>
          </div>
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
                    PKR {room.price}/night
                  </div>
                </div>
                <div className="room-content">
                  <div className="room-header">
                    <h3 className="room-title">{room.name}</h3>
                    <div className="room-meta">
                      <span className="room-size">{room.size}</span>
                      <span className="room-guests">Up to {room.maxGuests} guests</span>
                    </div>
                  </div>
                  <p className="room-description">{room.description}</p>
                  <div className="room-features">
                    {room.features.map((feature, index) => (
                      <span key={index} className="room-feature">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="room-actions">
                    <button 
                      className="btn btn-outline room-details-btn"
                      onClick={() => handleViewRoomDetails(room)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn btn-primary room-book-btn"
                      onClick={() => handleRoomBooking(room)}
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

      {/* Restaurant Section */}
      <section className="section restaurant-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              🍽️ Fine Dining
            </div>
            <h2 className="section-title">Restaurant & Bar</h2>
            <p className="section-description">
              Experience culinary excellence with our award-winning restaurant and premium bar
            </p>
          </div>
          
          <div className="restaurant-content">
            <div className="restaurant-info">
              <div className="restaurant-hours">
                <h3>Opening Hours</h3>
                <div className="hours-list">
                  <div className="hour-item">
                    <span className="meal-type">Breakfast</span>
                    <span className="time">6:00 AM - 10:30 AM</span>
                  </div>
                  <div className="hour-item">
                    <span className="meal-type">Lunch</span>
                    <span className="time">12:00 PM - 3:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="meal-type">Dinner</span>
                    <span className="time">6:00 PM - 11:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="meal-type">Bar</span>
                    <span className="time">5:00 PM - 1:00 AM</span>
                  </div>
                </div>
              </div>
              
              <div className="restaurant-features">
                <h3>Restaurant Features</h3>
                <div className="features-list">
                  <div className="feature-item">
                    <FaUtensils className="feature-icon" />
                    <span>International Cuisine</span>
                  </div>
                  <div className="feature-item">
                    <FaWineGlass className="feature-icon" />
                    <span>Premium Wine Selection</span>
                  </div>
                  <div className="feature-item">
                    <FaCoffee className="feature-icon" />
                    <span>Specialty Coffee Bar</span>
                  </div>
                  <div className="feature-item">
                    <FaConciergeBell className="feature-icon" />
                    <span>Room Service Available</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary restaurant-reservation-btn"
                  onClick={handleRestaurantReservation}
                  style={{marginTop: '24px', width: '100%'}}
                >
                  Make Reservation
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
            
            <div className="menu-preview">
              <h3>Menu Highlights</h3>
              {restaurantMenu.map((category, categoryIndex) => (
                <div key={categoryIndex} className="menu-category">
                  <h4 className="category-title">{category.category}</h4>
                  <div className="menu-items">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="menu-item">
                        <div className="item-info">
                          <h5 className="item-name">{item.name}</h5>
                          <p className="item-description">{item.description}</p>
                        </div>
                        <div className="item-price">${item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                className="btn btn-primary menu-btn"
                onClick={handleViewFullMenu}
              >
                View Full Menu
                <FaArrowRight className="btn-arrow" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section facilities-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              ✨ Hotel Facilities
            </div>
            <h2 className="section-title">World-Class Amenities</h2>
            <p className="section-description">
              Enjoy our comprehensive range of facilities designed for your comfort and convenience
            </p>
          </div>
          
          <div className="facilities-grid">
            {facilities.map((facility, index) => {
              const totalImgs = facility.images ? facility.images.length : 0;
              const currentImg = facilityImgIndexes[index] || 0;
              return (
                <div key={index} className="facility-card">
                  <div className="facility-image">
                    {facility.images && facility.images.length > 0 && (
                      <div className="facility-carousel">
                        <button onClick={() => handlePrevImg(index, totalImgs)} disabled={totalImgs <= 1}>&lt;</button>
                        <img src={facility.images[currentImg]} alt={facility.name + ' ' + (currentImg + 1)} className="facility-gallery-img" />
                        <button onClick={() => handleNextImg(index, totalImgs)} disabled={totalImgs <= 1}>&gt;</button>
                      </div>
                    )}
                  </div>
                  <div className="facility-icon">{facility.icon}</div>
                  <h3 className="facility-name">{facility.name}</h3>
                  <p className="facility-description">{facility.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="facilities-cta">
            <button 
              className="btn btn-primary facilities-btn"
              onClick={handleExploreFacilities}
            >
              Explore All Facilities
              <FaArrowRight className="btn-arrow" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="section destinations-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              🌍 Explore
            </div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-description">
              Discover amazing places and create unforgettable memories
            </p>
          </div>
          
          <div className="destinations-grid">
            <div className="destination-card" onClick={() => handleExploreDestination('Beach')}>
              <div className="destination-image">
                <img src="/assets/T1.jpg" alt="Beach Destinations" />
                <div className="destination-overlay">
                  <div className="destination-content">
                    <div className="destination-icon">
                      <FaUmbrellaBeach />
                    </div>
                    <h3 className="destination-title">Beach Destinations</h3>
                    <p className="destination-description">
                      Relax on pristine beaches with crystal clear waters
                    </p>
                    <button className="btn btn-primary destination-btn">
                      Explore Now
                      <FaArrowRight className="btn-arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="destination-card" onClick={() => handleExploreDestination('City')}>
              <div className="destination-image">
                <img src="/assets/T2.jpg" alt="City Hotels" />
                <div className="destination-overlay">
                  <div className="destination-content">
                    <div className="destination-icon">
                      <FaCar />
                    </div>
                    <h3 className="destination-title">City Hotels</h3>
                    <p className="destination-description">
                      Experience luxury in the heart of vibrant cities
                    </p>
                    <button className="btn btn-primary destination-btn">
                      Explore Now
                      <FaArrowRight className="btn-arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="destination-card" onClick={() => handleExploreDestination('Mountain')}>
              <div className="destination-image">
                <img src="/assets/View.jpg" alt="Mountain Resorts" />
                <div className="destination-overlay">
                  <div className="destination-content">
                    <div className="destination-icon">
                      <FaRoute />
                    </div>
                    <h3 className="destination-title">Mountain Resorts</h3>
                    <p className="destination-description">
                      Escape to serene mountain retreats and fresh air
                    </p>
                    <button className="btn btn-primary destination-btn">
                      Explore Now
                      <FaArrowRight className="btn-arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="section deals-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge hot">
              🔥 Hot Deals
            </div>
            <h2 className="section-title">Exclusive Deals & Offers</h2>
            <p className="section-description">
              Limited-time offers you won't find anywhere else
            </p>
          </div>
          
          <div className="deals-grid">
            <div className="deal-card summer">
              <div className="deal-badge limited">Limited Time</div>
              <div className="deal-content">
                <div className="deal-header">
                  <div className="deal-icon">🏖️</div>
                  <h3 className="deal-title">Summer Special</h3>
                </div>
                <p className="deal-description">
                  Save up to 30% on beach destinations. Book now for your perfect summer getaway with premium amenities included.
                </p>
                <div className="deal-info">
                  <div className="deal-price">Save up to 30%</div>
                  <div className="deal-validity">Valid until Aug 31</div>
                </div>
                <button className="btn btn-primary deal-btn">
                  Book Now
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
            
            <div className="deal-card extended">
              <div className="deal-badge popular">Popular</div>
              <div className="deal-content">
                <div className="deal-header">
                  <div className="deal-icon">🏨</div>
                  <h3 className="deal-title">Extended Stay Discount</h3>
                </div>
                <p className="deal-description">
                  Stay 3 nights or more and get 20% off your total booking at participating hotels with free breakfast included.
                </p>
                <div className="deal-info">
                  <div className="deal-price">20% Off</div>
                  <div className="deal-validity">3+ nights minimum</div>
                </div>
                <button className="btn btn-outline deal-btn">
                  Learn More
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              ✨ Premium Features
            </div>
            <h2 className="section-title">Why Choose Yasin Heaven Star Hotel</h2>
            <p className="section-description">
              Experience the difference with our premium services and amenities
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon customer-service">
                <FaConciergeBell />
              </div>
              <h3 className="feature-title">24/7 Customer Service</h3>
              <p className="feature-description">
                Our dedicated support team is available around the clock to assist you with any questions or concerns, ensuring a seamless experience.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon price-guarantee">
                <FaStar />
              </div>
              <h3 className="feature-title">Best Price Guarantee</h3>
              <p className="feature-description">
                We guarantee the lowest prices on hotel bookings. Find a better deal elsewhere? We'll match it and beat it by 5%.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon amenities">
                <FaWifi />
              </div>
              <h3 className="feature-title">Premium Amenities</h3>
              <p className="feature-description">
                Enjoy complimentary Wi-Fi, parking, pool access, and many other premium amenities at our carefully selected partner hotels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section newsletter-section">
        <div className="newsletter-background">
          <div className="newsletter-overlay"></div>
          <div className="newsletter-element-1"></div>
          <div className="newsletter-element-2"></div>
        </div>
        
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-badge">📧 Stay Connected</div>
            <h2 className="newsletter-title">Stay Updated with Exclusive Offers</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter and be the first to know about special deals, new destinations, and insider travel tips.
            </p>
            
            <div className="newsletter-form-container">
              <form className="newsletter-form" onSubmit={handleNewsletterSignup}>
                <div className="newsletter-input-container">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email address" 
                    className="newsletter-input"
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary newsletter-btn">
                  Subscribe
                  <FaArrowRight className="btn-arrow" />
                </button>
              </form>
              <p className="newsletter-disclaimer">
                Join 50,000+ travelers who trust us for the best hotel deals. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookRoomModal
          selectedRoom={selectedRoom}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSubmit}
        />
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirmation && bookingSuccess && (
        <div className="booking-confirmation-overlay" onClick={handleCloseBookingConfirmation}>
          <div className="booking-confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-confirmation-header">
              <div className="success-icon">
                <FaCheckCircle style={{ color: '#28a745', fontSize: '3rem' }} />
              </div>
              <h2>🎉 Booking Request Submitted!</h2>
              <button 
                className="modal-close-btn" 
                onClick={handleCloseBookingConfirmation}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            
            <div className="booking-confirmation-content">
              <div className="status-info" style={{
                background: '#e3f2fd', 
                padding: '1rem', 
                borderRadius: '8px', 
                margin: '1rem 0',
                border: '1px solid #2196f3'
              }}>
                <h3 style={{ color: '#1976d2', margin: '0 0 0.5rem 0' }}>
                  📋 What happens next?
                </h3>
                <ul style={{ color: '#0d47a1', margin: 0, paddingLeft: '1.2rem' }}>
                  {bookingSuccess.nextSteps.map((step, index) => (
                    <li key={index}>✅ {step}</li>
                  ))}
                </ul>
              </div>
              
              <div className="booking-id-section" style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                margin: '1rem 0',
                border: '2px dashed #6c757d'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
                  📄 Booking Reference
                </h4>
                <p style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  color: '#007bff',
                  fontFamily: 'monospace',
                  margin: 0
                }}>
                  ID: {bookingSuccess.booking._id}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: '0.5rem 0 0 0' }}>
                  Please save this reference number for your records
                </p>
              </div>
              
              <div className="confirmation-details">
                <h3>📋 Booking Summary</h3>
                <div className="summary-card" style={{
                  background: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  margin: '1rem 0'
                }}>
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <p><strong>🏨 Room:</strong> {bookingSuccess.room.name}</p>
                    <p><strong>👤 Guest:</strong> {bookingSuccess.bookingData.guestName}</p>
                    <p><strong>📧 Email:</strong> {bookingSuccess.bookingData.email}</p>
                    <p><strong>📞 Phone:</strong> {bookingSuccess.bookingData.phone}</p>
                    <p><strong>📅 Check-in:</strong> {new Date(bookingSuccess.bookingData.checkIn).toLocaleDateString()}</p>
                    <p><strong>📅 Check-out:</strong> {new Date(bookingSuccess.bookingData.checkOut).toLocaleDateString()}</p>
                    <p><strong>👥 Guests:</strong> {bookingSuccess.bookingData.guests}</p>
                    <p><strong>💰 Room Rate:</strong> <span style={{ 
                      color: '#28a745', 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold' 
                    }}>PKR {bookingSuccess.room.price}/night</span></p>
                    <p><strong>📊 Status:</strong> <span style={{ 
                      color: '#ffc107', 
                      fontWeight: 'bold',
                      background: '#fff3cd',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>⏳ Pending Approval</span></p>
                  </div>
                </div>
              </div>

              <div className="confirmation-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => navigate('/booking')}
                  className="btn btn-primary"
                >
                  View My Bookings
                </button>
                <button 
                  onClick={handleCloseBookingConfirmation}
                  className="btn btn-secondary"
                >
                  Continue Browsing
                </button>
              </div>
              
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                background: '#d4edda', 
                borderRadius: '8px',
                border: '1px solid #c3e6cb',
                color: '#155724'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  💡 <strong>Tip:</strong> You can track your booking status in real-time on the 
                  "My Bookings" page. We'll also send you email updates at each step of the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default HomePage;
