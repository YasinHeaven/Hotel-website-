import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaTag } from 'react-icons/fa';
import './DealsPage.css';

const DealsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const deals = [
    {
      id: 1,
      title: "Summer Beach Getaway",
      description: "Save up to 40% on beachfront hotels. Perfect for your summer vacation with family and friends.",
      discount: "40% OFF",
      category: "seasonal",
      validUntil: "2025-08-31",
      image: "/assets/Home 1.jpg",
      destinations: ["Miami", "Cancun", "Hawaii", "Bahamas"],
      originalPrice: 299,
      discountedPrice: 179,
      featured: true
    },
    {
      id: 2,
      title: "Extended Stay Special",
      description: "Book 7+ nights and get 25% off your entire stay. Perfect for business travelers and extended vacations.",
      discount: "25% OFF",
      category: "extended",
      validUntil: "2025-12-31",
      image: "/assets/Master .jpg",
      destinations: ["New York", "Los Angeles", "Chicago", "Boston"],
      originalPrice: 199,
      discountedPrice: 149,
      featured: false
    },
    {
      id: 3,
      title: "Weekend City Break",
      description: "Explore vibrant cities with our weekend packages. Includes hotel stay and city tour.",
      discount: "30% OFF",
      category: "weekend",
      validUntil: "2025-07-15",
      image: "/assets/View.jpg",
      destinations: ["Paris", "London", "Rome", "Barcelona"],
      originalPrice: 249,
      discountedPrice: 174,
      featured: true
    },
    {
      id: 4,
      title: "Last Minute Deals",
      description: "Book within 24 hours and save big on available rooms. Limited time offer!",
      discount: "50% OFF",
      category: "lastminute",
      validUntil: "2025-07-10",
      image: "/assets/Home 2.jpg",
      destinations: ["Las Vegas", "Orlando", "San Francisco", "Seattle"],
      originalPrice: 399,
      discountedPrice: 199,
      featured: false
    },
    {
      id: 5,
      title: "Luxury Resort Package",
      description: "Experience ultimate luxury with our premium resort package. Includes spa treatments and fine dining.",
      discount: "35% OFF",
      category: "luxury",
      validUntil: "2025-09-30",
      image: "/assets/home 3.jpg",
      destinations: ["Maldives", "Bali", "Santorini", "Dubai"],
      originalPrice: 599,
      discountedPrice: 389,
      featured: true
    },
    {
      id: 6,
      title: "Family Fun Package",
      description: "Perfect for families! Includes kids' activities, family rooms, and complimentary breakfast.",
      discount: "20% OFF",
      category: "family",
      validUntil: "2025-08-15",
      image: "/assets/Single Bed Pic.jpg",
      destinations: ["Disney World", "Universal Studios", "Great Wolf Lodge", "Atlantis"],
      originalPrice: 329,
      discountedPrice: 263,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Deals', icon: <FaTag /> },
    { id: 'seasonal', name: 'Seasonal', icon: <FaCalendarAlt /> },
    { id: 'extended', name: 'Extended Stay', icon: <FaClock /> },
    { id: 'weekend', name: 'Weekend', icon: <FaCalendarAlt /> },
    { id: 'lastminute', name: 'Last Minute', icon: <FaClock /> },
    { id: 'luxury', name: 'Luxury', icon: <FaStar /> },
    { id: 'family', name: 'Family', icon: <FaMapMarkerAlt /> }
  ];

  const filteredDeals = selectedCategory === 'all' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory);

  const featuredDeals = deals.filter(deal => deal.featured);

  const calculateDaysLeft = (validUntil) => {
    const today = new Date();
    const endDate = new Date(validUntil);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="deals-page">
      <div className="deals-header">
        <div className="container">
          <h1>Exclusive Deals & Offers</h1>
          <p>Don't miss out on amazing savings for your next getaway</p>
        </div>
      </div>

      {/* Featured Deals */}
      <section className="featured-deals-section">
        <div className="container">
          <h2>Featured Deals</h2>
          <div className="featured-deals-grid">
            {featuredDeals.map(deal => (
              <div key={deal.id} className="featured-deal-card">
                <div className="deal-image">
                  <img src={deal.image} alt={deal.title} />
                  <div className="deal-badge">{deal.discount}</div>
                  <div className="deal-timer">
                    <FaClock />
                    {calculateDaysLeft(deal.validUntil)} days left
                  </div>
                </div>
                <div className="deal-content">
                  <h3>{deal.title}</h3>
                  <p>{deal.description}</p>
                  <div className="deal-destinations">
                    <FaMapMarkerAlt />
                    {deal.destinations.slice(0, 2).join(', ')}
                    {deal.destinations.length > 2 && ` +${deal.destinations.length - 2} more`}
                  </div>
                  <div className="deal-pricing">
                    <span className="original-price">${deal.originalPrice}</span>
                    <span className="discounted-price">${deal.discountedPrice}</span>
                    <span className="price-unit">per night</span>
                  </div>
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Deals */}
      <section className="all-deals-section">
        <div className="container">
          <div className="deals-filters">
            <h2>All Deals</h2>
            <div className="category-filters">
              {categories.map(category => (
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
          </div>

          <div className="deals-grid">
            {filteredDeals.map(deal => (
              <div key={deal.id} className="deal-card">
                <div className="deal-image">
                  <img src={deal.image} alt={deal.title} />
                  <div className="deal-badge">{deal.discount}</div>
                </div>
                <div className="deal-content">
                  <h3>{deal.title}</h3>
                  <p>{deal.description}</p>
                  <div className="deal-details">
                    <div className="deal-destinations">
                      <FaMapMarkerAlt />
                      {deal.destinations.slice(0, 2).join(', ')}
                      {deal.destinations.length > 2 && ` +${deal.destinations.length - 2} more`}
                    </div>
                    <div className="deal-validity">
                      <FaClock />
                      Valid until {new Date(deal.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="deal-pricing">
                    <span className="original-price">${deal.originalPrice}</span>
                    <span className="discounted-price">${deal.discountedPrice}</span>
                    <span className="price-unit">per night</span>
                  </div>
                  <button className="btn btn-primary">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="deals-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Never Miss a Deal</h2>
            <p>Subscribe to our newsletter and get exclusive deals delivered to your inbox</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DealsPage;
