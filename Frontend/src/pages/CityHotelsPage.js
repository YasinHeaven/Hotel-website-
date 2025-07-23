import { useState } from 'react';
import { FaArrowRight, FaBuilding, FaMapMarkerAlt, FaSearch, FaShoppingBag, FaStar, FaTaxi } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CityHotelsPage.css';

const CityHotelsPage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  const cityHotels = [
    {
      id: 1,
      name: "Yasin Heaven Metropolitan",
      location: "Manhattan, New York",
      rating: 4.9,
      price: 450,
      image: "/assets/Master .jpg",
      amenities: ["WiFi", "Conference Room", "Concierge", "Fitness Center", "Restaurant"],
      description: "Luxury hotel in the heart of Manhattan with stunning city skyline views.",
      features: ["Skyline Views", "Conference Room", "24/7 Room Service", "Rooftop Bar"]
    },
    {
      id: 2,
      name: "Yasin Heaven Downtown",
      location: "Chicago, Illinois",
      rating: 4.8,
      price: 380,
      image: "/assets/Single Bed Pic.jpg",
      amenities: ["WiFi", "Parking", "Restaurant", "Bar", "Meeting Rooms"],
      description: "Modern downtown hotel with easy access to shopping and dining districts.",
      features: ["Shopping District", "Theater Access", "Executive Lounge", "City Tours"]
    },
    {
      id: 3,
      name: "Yasin Heaven Business District",
      location: "San Francisco, California",
      rating: 4.7,
      price: 420,
      image: "/assets/T2.jpg",
      amenities: ["WiFi", "Conference Room", "Fitness Center", "Spa", "Concierge"],
      description: "Elegant hotel in the financial district with panoramic bay views.",
      features: ["Bay Views", "Tech Hub Access", "Executive Services", "Wine Bar"]
    },
    {
      id: 4,
      name: "Yasin Heaven Urban Retreat",
      location: "Boston, Massachusetts",
      rating: 4.6,
      price: 350,
      image: "/assets/Washroom Dulex close.jpg",
      amenities: ["WiFi", "Parking", "Restaurant", "Fitness Center", "Pet Friendly"],
      description: "Historic charm meets modern luxury in the heart of Boston.",
      features: ["Historic District", "Freedom Trail", "University Access", "Cultural Sites"]
    }
  ];

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('City hotels search:', searchData);
  };

  const handleBookNow = (hotel) => {
    navigate('/booking', { state: { hotel, destination: 'city' } });
  };

  return (
    <div className="city-hotels-page">
      {/* Hero Section */}
      <section className="city-hero">
        <div className="city-hero-overlay"></div>
        <div className="city-hero-content">
          <div className="container">
            <div className="city-hero-text">
              <div className="hero-badge">
                🏙️ Urban Destinations
              </div>
              <h1 className="hero-title">
                Experience the Energy of <span className="hero-highlight">City Hotels</span>
              </h1>
              <p className="hero-description">
                Stay in the heart of the world's greatest cities with unparalleled access to business, culture, and entertainment.
              </p>
            </div>
            
            {/* Search Form */}
            <div className="search-card">
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-field">
                  <label htmlFor="destination">
                    <FaMapMarkerAlt className="search-icon" />
                    City Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    placeholder="Which city are you visiting?"
                    value={searchData.destination}
                    onChange={handleInputChange}
                    className="search-input"
                  />
                </div>
                
                <div className="search-field">
                  <label htmlFor="checkIn">Check-in</label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={searchData.checkIn}
                    onChange={handleInputChange}
                    className="search-input"
                  />
                </div>
                
                <div className="search-field">
                  <label htmlFor="checkOut">Check-out</label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={searchData.checkOut}
                    onChange={handleInputChange}
                    className="search-input"
                  />
                </div>
                
                <div className="search-field">
                  <label htmlFor="guests">Guests</label>
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
                  </select>
                </div>
                
                <button type="submit" className="search-button">
                  <FaSearch className="search-btn-icon" />
                  Search City Hotels
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* City Hotels Grid */}
      <section className="section hotels-grid-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our City Hotels</h2>
            <p className="section-description">
              Premium urban accommodations in prime locations with world-class amenities
            </p>
          </div>
          
          <div className="hotels-grid">
            {cityHotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-rating">
                    <FaStar className="star-icon" />
                    {hotel.rating}
                  </div>
                </div>
                
                <div className="hotel-content">
                  <div className="hotel-header">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <div className="hotel-location">
                      <FaMapMarkerAlt className="location-icon" />
                      {hotel.location}
                    </div>
                  </div>
                  
                  <p className="hotel-description">{hotel.description}</p>
                  
                  <div className="hotel-features">
                    {hotel.features.map((feature, index) => (
                      <span key={index} className="feature-tag city-feature">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="amenity-item">
                        <FaBuilding className="amenity-icon" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price-label">From</span>
                      <span className="price-amount">${hotel.price}</span>
                      <span className="price-period">per night</span>
                    </div>
                    <button 
                      className="btn btn-primary hotel-book-btn"
                      onClick={() => handleBookNow(hotel)}
                    >
                      Book Now
                      <FaArrowRight className="btn-arrow" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Experiences Section */}
      <section className="section city-experiences">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Urban Experiences</h2>
            <p className="section-description">
              Discover what makes each city unique with our curated experiences and local insights
            </p>
          </div>
          
          <div className="experiences-grid">
            <div className="experience-card">
              <div className="experience-icon">
                <FaBuilding />
              </div>
              <h3>Business Services</h3>
              <p>Executive lounges, meeting rooms, and conference facilities for the modern traveler.</p>
            </div>
            
            <div className="experience-card">
              <div className="experience-icon">
                <FaShoppingBag />
              </div>
              <h3>Shopping & Dining</h3>
              <p>Prime locations near shopping districts, restaurants, and entertainment venues.</p>
            </div>
            
            <div className="experience-card">
              <div className="experience-icon">
                <FaTaxi />
              </div>
              <h3>Easy Transportation</h3>
              <p>Strategic locations with access to public transport, airports, and major attractions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityHotelsPage;
