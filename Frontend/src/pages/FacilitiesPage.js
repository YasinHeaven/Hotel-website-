import { useState } from 'react';
import { FaArrowRight, FaCar, FaCheckCircle, FaClock, FaConciergeBell, FaHeart, FaMapMarkerAlt, FaPhone, FaRoute, FaShare, FaShoppingBag, FaUmbrellaBeach, FaUsers, FaWifi } from 'react-icons/fa';
import './FacilitiesPage.css';

const FacilitiesPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    guests: '1',
    specialRequests: ''
  });

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = (e) => {
    e.preventDefault();
    console.log('Facility booking submitted:', bookingData);
    alert(`Thank you ${bookingData.name}!\n\nYour ${bookingData.service} booking has been submitted:\n• Date: ${bookingData.date}\n• Time: ${bookingData.time}\n• Guests: ${bookingData.guests}\n\nWe'll contact you shortly to confirm your booking.`);
  };

  const handleFacilityDetail = (facility) => {
    setSelectedFacility(facility);
  };

  const facilities = [
    {
      id: 1,
      name: 'Conference Room',
      category: 'Business',
      icon: <FaWifi />,
      image: '/assets/T1.jpg',
      description: 'Modern conference room with high-speed internet, printing services, and video conferencing facilities.',
      features: ['High-Speed WiFi', 'Printing Services', 'Video Conferencing', 'Projector & Screen', 'Computer Workstations'],
      hours: '24/7',
      capacity: '25 guests',
      price: 'Complimentary',
      rating: 4.6,
      popular: false
    },
    {
      id: 2,
      name: 'Valet Parking',
      category: 'Services',
      icon: <FaCar />,
      image: '/assets/T2.jpg',
      description: 'Premium valet parking service with 24/7 availability and luxury vehicle care.',
      features: ['24/7 Service', 'Luxury Vehicle Care', 'Covered Parking', 'Quick Service', 'Security'],
      hours: '24/7',
      capacity: '100 vehicles',
      price: '$25/night',
      rating: 4.5,
      popular: false
    },
    {
      id: 3,
      name: 'Concierge Services',
      category: 'Services',
      icon: <FaConciergeBell />,
      image: '/assets/Washroom Dulex.jpg',
      description: 'Personalized concierge services for reservations, tours, transportation, and local recommendations.',
      features: ['Restaurant Reservations', 'Tour Bookings', 'Transportation', 'Local Recommendations', 'Event Planning'],
      hours: '24/7',
      capacity: 'Unlimited',
      price: 'Complimentary',
      rating: 4.9,
      popular: true
    },
    {
      id: 4,
      name: 'Rooftop Terrace',
      category: 'Recreation',
      icon: <FaUmbrellaBeach />,
      image: '/assets/Washroom Dulex close.jpg',
      description: 'Spectacular rooftop terrace with panoramic city views, lounge seating, and outdoor dining.',
      features: ['Panoramic Views', 'Lounge Seating', 'Outdoor Dining', 'Fire Pit', 'Sunset Views'],
      hours: '6:00 AM - 12:00 AM',
      capacity: '40 guests',
      price: 'Complimentary',
      rating: 4.8,
      popular: true
    },
    {
      id: 5,
      name: 'Gift Shop',
      category: 'Shopping',
      icon: <FaShoppingBag />,
      image: '/assets/Home 1.jpg',
      description: 'Hotel gift shop offering local handicrafts, souvenirs, snacks, and travel essentials.',
      features: ['Local Handicrafts', 'Souvenirs', 'Snacks & Beverages', 'Travel Essentials', 'Postcards'],
      hours: '8:00 AM - 9:00 PM',
      capacity: '15 guests',
      price: 'Items priced separately',
      rating: 4.3,
      popular: false
    },
    {
      id: 6,
      name: 'Tours & Travels Services',
      category: 'Services',
      icon: <FaRoute />,
      image: '/assets/View.jpg',
      description: 'Complete tour and travel services including local sightseeing, trekking, and adventure tours.',
      features: ['Local Sightseeing', 'Trekking Tours', 'Adventure Activities', 'Transportation', 'Guide Services', 'Rent a Car'],
      hours: '7:00 AM - 7:00 PM',
      capacity: 'Groups up to 20',
      price: 'Starting from $50/person',
      rating: 4.7,
      popular: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Facilities' },
    { id: 'Recreation', name: 'Recreation' },
    { id: 'Business', name: 'Business' },
    { id: 'Services', name: 'Services' },
    { id: 'Entertainment', name: 'Entertainment' },
    { id: 'Shopping', name: 'Shopping' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFacilities = selectedCategory === 'all' 
    ? facilities 
    : facilities.filter(facility => facility.category === selectedCategory);

  const amenityHighlights = [
    {
      icon: <FaConciergeBell />,
      title: '24/7 Concierge',
      description: 'Personalized service to enhance your stay experience'
    },
    {
      icon: <FaWifi />,
      title: 'Business Ready',
      description: 'Modern business facilities for work and meetings'
    },
    {
      icon: <FaCheckCircle />,
      title: '24/7 Security Cameras',
      description: 'Continuous surveillance for your safety and peace of mind'
    }
  ];

  return (
    <div className="facilities-page">
      {/* Hero Section */}
      <section className="facilities-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="facilities-hero-content">
          <div className="container">
            <div className="facilities-hero-text">
              <div className="hero-badge">
                ✨ World-Class Amenities
              </div>
              <h1 className="hero-title">
                Experience Luxury <span className="hero-highlight">Facilities</span>
              </h1>
              <p className="hero-description">
                Discover our comprehensive range of premium facilities designed to enhance every moment of your stay with comfort, convenience, and luxury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Facilities?</h2>
          <div className="highlights-grid">
            {amenityHighlights.map((highlight, index) => (
              <div key={index} className="highlight-card">
                <div className="highlight-icon">{highlight.icon}</div>
                <h3 className="highlight-title">{highlight.title}</h3>
                <p className="highlight-description">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Facilities</h2>
            <p className="section-description">
              Explore our comprehensive range of amenities and services designed for your comfort and enjoyment
            </p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Facilities Grid */}
          <div className="facilities-grid">
            {filteredFacilities.map((facility) => (
              <div key={facility.id} className="facility-card">
                <div className="facility-image">
                  <img src={facility.image} alt={facility.name} />
                  {facility.popular && (
                    <div className="popular-badge">
                      <FaCheckCircle className="check-icon" />
                      Popular
                    </div>
                  )}
                  <div className="facility-actions">
                    <button className="action-btn favorite">
                      <FaHeart />
                    </button>
                    <button className="action-btn share">
                      <FaShare />
                    </button>
                  </div>
                  <div className="facility-category">
                    {facility.category}
                  </div>
                </div>
                <div className="facility-content">
                  <div className="facility-header">
                    <div className="facility-icon">{facility.icon}</div>
                    <h3 className="facility-name">{facility.name}</h3>
                    <div className="facility-rating">
                      <span className="rating-star">★</span>
                      {facility.rating}
                    </div>
                  </div>
                  <p className="facility-description">{facility.description}</p>
                  <div className="facility-features">
                    {facility.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                    {facility.features.length > 3 && (
                      <span className="feature-more">+{facility.features.length - 3} more</span>
                    )}
                  </div>
                  <div className="facility-info">
                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <span>{facility.hours}</span>
                    </div>
                    <div className="info-item">
                      <FaUsers className="info-icon" />
                      <span>{facility.capacity}</span>
                    </div>
                    <div className="info-item">
                      <span className="price">{facility.price}</span>
                    </div>
                  </div>
                  <div className="facility-actions-bottom">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleFacilityDetail(facility)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setBookingData({...bookingData, service: facility.name})}
                    >
                      Book Now
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section">
        <div className="container">
          <div className="booking-content">
            <div className="booking-info">
              <h2 className="booking-title">Book a Facility</h2>
              <p className="booking-description">
                Reserve your preferred facility or service in advance to ensure availability during your stay.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <h4>Phone</h4>
                    <p>(800) 123-4567</p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <h4>Location</h4>
                    <p>Yasin Heaven Star Hotel</p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaClock className="contact-icon" />
                  <div>
                    <h4>Booking Hours</h4>
                    <p>Daily 8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="booking-form" onSubmit={handleBooking}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bookingData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Facility/Service</label>
                <select
                  id="service"
                  name="service"
                  value={bookingData.service}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a facility</option>
                  {facilities.map(facility => (
                    <option key={facility.id} value={facility.name}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6+">6+ Guests</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special requirements or requests?"
                  className="form-textarea"
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-large">
                Book Facility
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacilitiesPage;
