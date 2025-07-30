import { useState } from 'react';
import { FaArrowRight, FaConciergeBell, FaHeart, FaMapMarkerAlt, FaParking, FaPhone, FaSearch, FaShare, FaStar, FaSwimmingPool, FaUsers, FaWifi } from 'react-icons/fa';
import { getAssetPath, createImageErrorHandler } from '../utils/assetUtils';
import './MountainResortsPage.css';

const MountainResortsPage = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: 'standard'
  });

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Mountain resort search:', searchData);
  };

  const handleBookNow = (resort) => {
    alert(`Booking ${resort.name}...\nThis would redirect to the booking page with pre-filled resort details.`);
  };

  const handleViewDetails = (resort) => {
    alert(`${resort.name} Details:\n\nLocation: ${resort.location}\nRating: ${resort.rating}/5\nPrice: $${resort.price}/night\n\nAmenities:\n${resort.amenities.join(', ')}\n\n${resort.description}`);
  };

  const mountainResorts = [
    {
      id: 1,
      name: 'Alpine Peak Resort',
      location: 'Swiss Alps, Switzerland',
      rating: 4.8,
      price: 320,
      image: getAssetPath('View.jpg', 'homepage'),
      amenities: ['Ski Access', 'Mountain View', 'Spa', 'Restaurant', 'Free WiFi'],
      description: 'Luxury mountain resort with direct ski access and breathtaking alpine views.'
    },
    {
      id: 2,
      name: 'Rocky Mountain Lodge',
      location: 'Colorado, USA',
      rating: 4.7,
      price: 280,
      image: getAssetPath('Home 1.jpg', 'homepage'),
      amenities: ['Hiking Trails', 'Fireplace', 'Pool', 'Gym', 'Pet Friendly'],
      description: 'Rustic luxury lodge perfect for adventure seekers and nature lovers.'
    },
    {
      id: 3,
      name: 'Himalayan Retreat',
      location: 'Nepal Himalayas',
      rating: 4.9,
      price: 450,
      image: getAssetPath('Home 2.jpg', 'homepage'),
      amenities: ['Mountain Guides', 'Yoga Classes', 'Organic Restaurant', 'Meditation Center'],
      description: 'Exclusive retreat offering spiritual experiences with stunning Himalayan views.'
    },
    {
      id: 4,
      name: 'Aspen Valley Resort',
      location: 'Aspen, Colorado',
      rating: 4.6,
      price: 380,
      image: getAssetPath('home 3.jpg', 'homepage'),
      amenities: ['Luxury Ski-in/Ski-out', 'Spa', 'Fine Dining', 'Golf Course'],
      description: 'Premier mountain resort with world-class skiing and luxury amenities.'
    },
    {
      id: 5,
      name: 'Patagonia Base Camp',
      location: 'Torres del Paine, Chile',
      rating: 4.5,
      price: 220,
      image: getAssetPath('Single Bed Close.jpg', 'room'),
      amenities: ['Guided Tours', 'Wildlife Viewing', 'Camping', 'Restaurant'],
      description: 'Adventure basecamp for exploring the dramatic landscapes of Patagonia.'
    },
    {
      id: 6,
      name: 'Mount Fuji Onsen',
      location: 'Mount Fuji, Japan',
      rating: 4.8,
      price: 350,
      image: getAssetPath('Master Bed .mp4.jpg', 'room'),
      amenities: ['Hot Springs', 'Traditional Rooms', 'Mountain View', 'Japanese Cuisine'],
      description: 'Traditional Japanese resort with natural hot springs and Mount Fuji views.'
    }
  ];

  const features = [
    {
      icon: <FaSwimmingPool />,
      title: 'Adventure Activities',
      description: 'Hiking, skiing, rock climbing, and more outdoor adventures'
    },
    {
      icon: <FaConciergeBell />,
      title: 'Mountain Guides',
      description: 'Expert local guides for safe and memorable mountain experiences'
    },
    {
      icon: <FaWifi />,
      title: 'Scenic Views',
      description: 'Breathtaking panoramic views of mountains and valleys'
    },
    {
      icon: <FaParking />,
      title: 'Wellness Retreats',
      description: 'Spa services, yoga, and meditation in serene mountain settings'
    }
  ];

  return (
    <div className="mountain-page">
      {/* Hero Section */}
      <section className="mountain-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="mountain-hero-content">
          <div className="container">
            <div className="mountain-hero-text">
              <div className="hero-badge">
                🏔️ Mountain Destinations
              </div>
              <h1 className="hero-title">
                Find Your Perfect <span className="hero-highlight">Mountain Retreat</span>
              </h1>
              <p className="hero-description">
                Escape to breathtaking mountain resorts where adventure meets luxury and serenity awaits at every turn.
              </p>
            </div>
            
            {/* Search Form */}
            <div className="search-card">
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-field">
                  <label htmlFor="destination">
                    <FaMapMarkerAlt className="search-icon" />
                    Mountain Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    placeholder="Which mountain region?"
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
                  <label htmlFor="guests">
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
                <button type="submit" className="search-btn">
                  <FaSearch />
                  Search Resorts
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Mountain Resorts?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resorts Grid */}
      <section className="resorts-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Mountain Resorts</h2>
            <p className="section-description">
              Discover our handpicked selection of premier mountain destinations
            </p>
          </div>
          <div className="resorts-grid">
            {mountainResorts.map((resort) => (
              <div key={resort.id} className="resort-card">
                <div className="resort-image">
                  <img 
                    src={resort.image} 
                    alt={resort.name}
                    onError={createImageErrorHandler('general')}
                  />
                  <div className="resort-actions">
                    <button className="action-btn favorite">
                      <FaHeart />
                    </button>
                    <button className="action-btn share">
                      <FaShare />
                    </button>
                  </div>
                  <div className="resort-badge">
                    <FaStar className="star-icon" />
                    {resort.rating}
                  </div>
                </div>
                <div className="resort-content">
                  <div className="resort-header">
                    <h3 className="resort-name">{resort.name}</h3>
                    <div className="resort-location">
                      <FaMapMarkerAlt className="location-icon" />
                      {resort.location}
                    </div>
                  </div>
                  <p className="resort-description">{resort.description}</p>
                  <div className="resort-amenities">
                    {resort.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                    {resort.amenities.length > 3 && (
                      <span className="amenity-more">+{resort.amenities.length - 3} more</span>
                    )}
                  </div>
                  <div className="resort-footer">
                    <div className="resort-pricing">
                      <span className="price">${resort.price}</span>
                      <span className="price-unit">/night</span>
                    </div>
                    <div className="resort-buttons">
                      <button
                        className="btn btn-outline"
                        onClick={() => handleViewDetails(resort)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleBookNow(resort)}
                      >
                        Book Now
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready for Your Mountain Adventure?</h2>
            <p className="cta-description">
              Book your mountain retreat today and experience the perfect blend of adventure, luxury, and natural beauty.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large">
                <FaPhone />
                Call (800) 123-4567
              </button>
              <button className="btn btn-outline btn-large">
                View All Destinations
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MountainResortsPage;
