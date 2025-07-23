import React, { useState } from 'react';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaConciergeBell, FaHeart } from 'react-icons/fa';
import './HotelsPage.css';

const HotelsPage = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    rating: 0,
    amenities: [],
    location: ''
  });

  const [sortBy, setSortBy] = useState('price');

  const hotelData = [
    {
      id: 1,
      name: "Luxury Beach Resort",
      location: "Miami Beach, FL",
      rating: 4.8,
      price: 299,
      image: "/assets/Home 1.jpg",
      amenities: ["WiFi", "Pool", "Parking", "Spa", "Restaurant"],
      description: "Beautiful beachfront resort with stunning ocean views"
    },
    {
      id: 2,
      name: "Downtown Business Hotel",
      location: "Manhattan, NY",
      rating: 4.5,
      price: 199,
      image: "/assets/Master .jpg",
      amenities: ["WiFi", "Gym", "Business Center", "Restaurant"],
      description: "Modern hotel in the heart of the city"
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      location: "Aspen, CO",
      rating: 4.7,
      price: 349,
      image: "/assets/View.jpg",
      amenities: ["WiFi", "Spa", "Restaurant", "Ski Access"],
      description: "Cozy mountain lodge with spectacular views"
    },
    {
      id: 4,
      name: "Historic Grand Hotel",
      location: "Savannah, GA",
      rating: 4.6,
      price: 229,
      image: "/assets/Home 2.jpg",
      amenities: ["WiFi", "Pool", "Restaurant", "Concierge"],
      description: "Elegant historic hotel with southern charm"
    },
    {
      id: 5,
      name: "Boutique City Hotel",
      location: "Seattle, WA",
      rating: 4.4,
      price: 179,
      image: "/assets/Single Bed Pic.jpg",
      amenities: ["WiFi", "Gym", "Restaurant", "Pet Friendly"],
      description: "Stylish boutique hotel in trendy neighborhood"
    },
    {
      id: 6,
      name: "Desert Oasis Resort",
      location: "Scottsdale, AZ",
      rating: 4.9,
      price: 399,
      image: "/assets/Washroom Dulex.jpg",
      amenities: ["WiFi", "Pool", "Spa", "Golf", "Restaurant"],
      description: "Luxurious desert resort with world-class amenities"
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <FaWifi />,
      'Pool': <FaSwimmingPool />,
      'Parking': <FaParking />,
      'Spa': <FaConciergeBell />,
      'Restaurant': <FaConciergeBell />,
      'Gym': <FaConciergeBell />,
      'Business Center': <FaConciergeBell />,
      'Concierge': <FaConciergeBell />,
      'Pet Friendly': <FaHeart />,
      'Ski Access': <FaConciergeBell />,
      'Golf': <FaConciergeBell />
    };
    return icons[amenity] || <FaConciergeBell />;
  };

  return (
    <div className="hotels-page">
      <div className="hotels-header">
        <div className="container">
          <h1>Find Your Perfect Hotel</h1>
          <p>Discover amazing places to stay around the world</p>
        </div>
      </div>

      <div className="hotels-content">
        <div className="container">
          <div className="hotels-layout">
            {/* Filters Sidebar */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Filters</h3>
                <FaFilter />
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  />
                  <div className="price-display">
                    $0 - ${filters.priceRange[1]}
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <h4>Minimum Rating</h4>
                <div className="rating-filter">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      className={`rating-btn ${filters.rating >= rating ? 'active' : ''}`}
                      onClick={() => handleFilterChange('rating', rating)}
                    >
                      {rating} <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h4>Amenities</h4>
                <div className="amenities-filter">
                  {['WiFi', 'Pool', 'Parking', 'Spa', 'Restaurant', 'Gym'].map(amenity => (
                    <label key={amenity} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('amenities', [...filters.amenities, amenity]);
                          } else {
                            handleFilterChange('amenities', filters.amenities.filter(a => a !== amenity));
                          }
                        }}
                      />
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Hotels List */}
            <main className="hotels-main">
              <div className="hotels-toolbar">
                <div className="results-count">
                  {hotelData.length} hotels found
                </div>
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="hotels-grid">
                {hotelData.map(hotel => (
                  <div key={hotel.id} className="hotel-card">
                    <div className="hotel-image">
                      <img src={hotel.image} alt={hotel.name} />
                      <button className="favorite-btn">
                        <FaHeart />
                      </button>
                    </div>
                    <div className="hotel-info">
                      <div className="hotel-header">
                        <h3>{hotel.name}</h3>
                        <div className="hotel-rating">
                          {renderStars(hotel.rating)}
                          <span className="rating-value">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="hotel-location">
                        <FaMapMarkerAlt />
                        {hotel.location}
                      </div>
                      <p className="hotel-description">{hotel.description}</p>
                      <div className="hotel-amenities">
                        {hotel.amenities.slice(0, 4).map(amenity => (
                          <span key={amenity} className="amenity-tag">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="more-amenities">+{hotel.amenities.length - 4} more</span>
                        )}
                      </div>
                      <div className="hotel-footer">
                        <div className="hotel-price">
                          <span className="price-label">From</span>
                          <span className="price-value">${hotel.price}</span>
                          <span className="price-unit">/ night</span>
                        </div>
                        <button className="btn btn-primary">Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
