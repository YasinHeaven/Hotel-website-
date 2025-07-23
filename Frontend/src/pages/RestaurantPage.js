import { useState } from 'react';
import { FaArrowRight, FaClock, FaFire, FaHeart, FaLeaf, FaMapMarkerAlt, FaPhone, FaShare, FaSnowflake, FaStar, FaUsers, FaUtensils, FaWineGlass } from 'react-icons/fa';
import './RestaurantPage.css';

const RestaurantPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });

  const handleInputChange = (e) => {
    setReservationData({
      ...reservationData,
      [e.target.name]: e.target.value
    });
  };

  const handleReservation = (e) => {
    e.preventDefault();
    console.log('Reservation submitted:', reservationData);
    alert(`Thank you ${reservationData.name}!\n\nYour reservation has been submitted:\n• Date: ${reservationData.date}\n• Time: ${reservationData.time}\n• Guests: ${reservationData.guests}\n\nWe'll contact you shortly to confirm your reservation.`);
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: <FaUtensils /> },
    { id: 'appetizers', name: 'Appetizers', icon: <FaLeaf /> },
    { id: 'mains', name: 'Main Courses', icon: <FaFire /> },
    { id: 'desserts', name: 'Desserts', icon: <FaSnowflake /> },
    { id: 'beverages', name: 'Beverages', icon: <FaWineGlass /> }
  ];

  const menuItems = [
    // Appetizers
    {
      id: 1,
      name: 'Truffle Arancini',
      description: 'Crispy risotto balls with truffle oil, parmesan, and wild mushrooms',
      price: 18,
      category: 'appetizers',
      image: '/assets/T1.jpg',
      rating: 4.8,
      popular: true,
      dietary: ['vegetarian']
    },
    {
      id: 2,
      name: 'Seared Scallops',
      description: 'Pan-seared scallops with cauliflower purée and pancetta crisps',
      price: 24,
      category: 'appetizers',
      image: '/assets/T2.jpg',
      rating: 4.9,
      popular: true,
      dietary: ['gluten-free']
    },
    {
      id: 3,
      name: 'Burrata Caprese',
      description: 'Fresh burrata with heirloom tomatoes, basil, and aged balsamic',
      price: 16,
      category: 'appetizers',
      image: '/assets/Master .jpg',
      rating: 4.7,
      dietary: ['vegetarian', 'gluten-free']
    },
    // Main Courses
    {
      id: 4,
      name: 'Wagyu Beef Tenderloin',
      description: 'Grade A5 wagyu with roasted vegetables and red wine reduction',
      price: 65,
      category: 'mains',
      image: '/assets/Home 1.jpg',
      rating: 4.9,
      popular: true,
      dietary: ['gluten-free']
    },
    {
      id: 5,
      name: 'Chilean Sea Bass',
      description: 'Miso-glazed sea bass with forbidden rice and bok choy',
      price: 42,
      category: 'mains',
      image: '/assets/Home 2.jpg',
      rating: 4.8,
      dietary: ['gluten-free']
    },
    {
      id: 6,
      name: 'Lobster Ravioli',
      description: 'House-made pasta with lobster, ricotta, and saffron cream sauce',
      price: 38,
      category: 'mains',
      image: '/assets/home 3.jpg',
      rating: 4.7,
      popular: true,
      dietary: []
    },
    // Desserts
    {
      id: 7,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center and vanilla ice cream',
      price: 14,
      category: 'desserts',
      image: '/assets/View.jpg',
      rating: 4.9,
      popular: true,
      dietary: ['vegetarian']
    },
    {
      id: 8,
      name: 'Crème Brûlée',
      description: 'Classic vanilla custard with caramelized sugar and fresh berries',
      price: 12,
      category: 'desserts',
      image: '/assets/Single Bed Pic.jpg',
      rating: 4.8,
      dietary: ['vegetarian', 'gluten-free']
    },
    // Beverages
    {
      id: 9,
      name: 'Sommelier\'s Selection',
      description: 'Curated wine pairing for your meal',
      price: 25,
      category: 'beverages',
      image: '/assets/Single Bed Close.jpg',
      rating: 4.9,
      dietary: []
    },
    {
      id: 10,
      name: 'Craft Cocktails',
      description: 'House-crafted cocktails with premium spirits',
      price: 16,
      category: 'beverages',
      image: '/assets/Washroom Dulex.jpg',
      rating: 4.8,
      dietary: []
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const restaurantFeatures = [
    {
      icon: <FaUtensils />,
      title: 'Fine Dining',
      description: 'Michelin-starred chef with international cuisine'
    },
    {
      icon: <FaWineGlass />,
      title: 'Wine Collection',
      description: 'Over 500 premium wines from around the world'
    },
    {
      icon: <FaClock />,
      title: 'Extended Hours',
      description: 'Open daily from 6 AM to 12 AM'
    },
    {
      icon: <FaUsers />,
      title: 'Private Dining',
      description: 'Exclusive dining rooms for special occasions'
    }
  ];

  return (
    <div className="restaurant-page">
      {/* Hero Section */}
      <section className="restaurant-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="restaurant-hero-content">
          <div className="container">
            <div className="restaurant-hero-text">
              <div className="hero-badge">
                🍽️ Fine Dining Experience
              </div>
              <h1 className="hero-title">
                Culinary Excellence at <span className="hero-highlight">Yasin Heaven Star Hotel</span>
              </h1>
              <p className="hero-description">
                Experience world-class cuisine crafted by our Michelin-starred chef, featuring locally sourced ingredients and innovative techniques.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">⭐ 4.9</div>
                  <div className="stat-label">Customer Rating</div>
                </div>
                <div className="stat">
                  <div className="stat-number">🏆 Michelin</div>
                  <div className="stat-label">Starred Chef</div>
                </div>
                <div className="stat">
                  <div className="stat-number">🍷 500+</div>
                  <div className="stat-label">Wine Selection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Dine With Us?</h2>
          <div className="features-grid">
            {restaurantFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Menu</h2>
            <p className="section-description">
              Discover our carefully curated selection of dishes, crafted with the finest ingredients
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
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} />
                  {item.popular && (
                    <div className="popular-badge">
                      <FaStar className="star-icon" />
                      Popular
                    </div>
                  )}
                  <div className="menu-item-actions">
                    <button className="action-btn favorite">
                      <FaHeart />
                    </button>
                    <button className="action-btn share">
                      <FaShare />
                    </button>
                  </div>
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <div className="menu-item-rating">
                      <FaStar className="star-icon" />
                      {item.rating}
                    </div>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                  {item.dietary.length > 0 && (
                    <div className="dietary-tags">
                      {item.dietary.map((diet, index) => (
                        <span key={index} className="dietary-tag">
                          {diet}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="menu-item-footer">
                    <div className="menu-item-price">${item.price}</div>
                    <button className="btn btn-primary">
                      Add to Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="reservation-section">
        <div className="container">
          <div className="reservation-content">
            <div className="reservation-info">
              <h2 className="reservation-title">Make a Reservation</h2>
              <p className="reservation-description">
                Reserve your table for an unforgettable dining experience. Our team will ensure every detail is perfect.
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
                    <h4>Hours</h4>
                    <p>Daily 6:00 AM - 12:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="reservation-form" onSubmit={handleReservation}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={reservationData.name}
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
                    value={reservationData.email}
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
                    value={reservationData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={reservationData.date}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <select
                    id="time"
                    name="time"
                    value={reservationData.time}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Time</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="21:30">9:30 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={reservationData.guests}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="7+">7+ Guests</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={reservationData.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any dietary restrictions, allergies, or special occasions?"
                  className="form-textarea"
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-large">
                Make Reservation
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantPage;
