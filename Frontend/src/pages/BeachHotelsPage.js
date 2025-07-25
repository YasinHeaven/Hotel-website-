import { useState } from 'react';
import { FaArrowRight, FaMapMarkerAlt, FaSearch, FaStar, FaSun, FaUmbrellaBeach, FaWater } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './BeachHotelsPage.css';

const BeachHotelsPage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  // Define minimum and maximum selectable dates: from today to end of current month in local time to avoid UTC offset issues
  const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const minDate = `${year}-${month}-${day}`; // e.g. "2025-07-25"
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const lastYear = lastDayOfMonth.getFullYear();
const lastMonth = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
const lastDay = String(lastDayOfMonth.getDate()).padStart(2, '0');
const maxDate = `${lastYear}-${lastMonth}-${lastDay}`; // e.g. "2025-07-31"

  const beachHotels = [
    {
      id: 1,
      name: "Yasin Heaven Beachfront Resort",
      location: "Malibu, California",
      rating: 4.9,
      price: 320,
      image: "/assets/Home 1.jpg",
      amenities: ["Private Beach", "WiFi", "Pool", "Spa", "Water Sports"],
      description: "Luxurious beachfront resort with direct beach access and panoramic ocean views.",
      features: ["Private Beach Access", "Ocean View Rooms", "Beach Volleyball", "Water Sports Center"]
    },
    {
      id: 2,
      name: "Yasin Heaven Coastal Retreat",
      location: "Miami Beach, Florida",
      rating: 4.7,
      price: 280,
      image: "/assets/View.jpg",
      amenities: ["Beach Access", "WiFi", "Pool", "Restaurant", "Bar"],
      description: "Modern beach hotel with Art Deco charm and vibrant nightlife nearby.",
      features: ["Art Deco Design", "Rooftop Pool", "Beach Cabanas", "Sunset Terrace"]
    },
    {
      id: 3,
      name: "Yasin Heaven Tropical Paradise",
      location: "Key West, Florida",
      rating: 4.8,
      price: 350,
      image: "/assets/Home 2.jpg",
      amenities: ["Private Beach", "WiFi", "Pool", "Spa", "Diving Center"],
      description: "Tropical paradise with crystal-clear waters and exceptional diving opportunities.",
      features: ["Diving Center", "Snorkeling Tours", "Private Pier", "Coral Reef Access"]
    },
    {
      id: 4,
      name: "Yasin Heaven Seaside Villa",
      location: "Outer Banks, North Carolina",
      rating: 4.6,
      price: 240,
      image: "/assets/home 3.jpg",
      amenities: ["Beach Access", "WiFi", "Pool", "Fitness Center", "Restaurant"],
      description: "Charming seaside villa with family-friendly amenities and lighthouse views.",
      features: ["Lighthouse Views", "Family Suites", "Kids Club", "Fishing Charters"]
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
    console.log('Beach hotels search:', searchData);
  };

  const handleBookNow = (hotel) => {
    navigate('/booking', { state: { hotel, destination: 'beach' } });
  };

  return (
    <div className="beach-hotels-page">
      {/* Hero Section */}
      <section className="beach-hero">
        <div className="beach-hero-overlay"></div>
        <div className="beach-hero-content">
          <div className="container">
            <div className="beach-hero-text">
              <div className="hero-badge">
                🏖️ Beach Destinations
              </div>
              <h1 className="hero-title">
                Discover Paradise at Our <span className="hero-highlight">Beach Hotels</span>
              </h1>
              <p className="hero-description">
                Wake up to the sound of waves and enjoy pristine beaches at our carefully selected beachfront properties.
              </p>
            </div>
            
            {/* Search Form */}
            <div className="search-card">
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-field">
                  <label htmlFor="destination">
                    <FaMapMarkerAlt className="search-icon" />
                    Beach Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    placeholder="Where do you want to go?"
                    value={searchData.destination}
                    onChange={handleInputChange}
                    className="search-input"
                  />
                </div>
                
                <div className="search-field">
                  <label htmlFor="checkIn">Check-in</label>
                  <input
                    type="date"
                    id="checkIn" min={minDate} max={maxDate}
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
                    id="checkOut" min={minDate} max={maxDate}
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
                  Search Beach Hotels
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Beach Hotels Grid */}
      <section className="section hotels-grid-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Beach Hotels</h2>
            <p className="section-description">
              Handpicked beachfront properties offering the perfect blend of luxury and natural beauty
            </p>
          </div>
          
          <div className="hotels-grid">
            {beachHotels.map((hotel) => (
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
                      <span key={index} className="feature-tag beach-feature">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="amenity-item">
                        <FaUmbrellaBeach className="amenity-icon" />
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

      {/* Beach Activities Section */}
      <section className="section beach-activities">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Beach Activities & Experiences</h2>
            <p className="section-description">
              Make the most of your beach vacation with our exciting activities and experiences
            </p>
          </div>
          
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-icon">
                <FaWater />
              </div>
              <h3>Water Sports</h3>
              <p>Enjoy jet skiing, parasailing, and windsurfing with professional instructors.</p>
            </div>
            
            <div className="activity-card">
              <div className="activity-icon">
                <FaUmbrellaBeach />
              </div>
              <h3>Beach Relaxation</h3>
              <p>Private cabanas, beach service, and premium loungers for ultimate comfort.</p>
            </div>
            
            <div className="activity-card">
              <div className="activity-icon">
                <FaSun />
              </div>
              <h3>Sunset Experiences</h3>
              <p>Romantic sunset dinners, beach bonfires, and evening entertainment.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeachHotelsPage;
