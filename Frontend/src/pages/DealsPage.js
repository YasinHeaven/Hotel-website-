import { useState } from 'react';
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import './DealsPage.css';

const DealsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Only the two requested food deals
  const deals = [
    {
      id: 1,
      title: "Long Stay Food Discount",
      description: "For long stays, enjoy a discount of 10% to 15% on all food orders during your stay.",
      discount: "10-15% OFF Food",
      category: "food",
      validUntil: "2025-12-31",
      destinations: ["Hotel Restaurant"],
      originalPrice: null,
      discountedPrice: null,
      featured: true
    },
    {
      id: 2,
      title: "Group Food Discount",
      description: "For groups, get a 10% discount on all food orders. Perfect for family, friends, or business groups!",
      discount: "10% OFF Food",
      category: "food",
      validUntil: "2025-12-31",
      destinations: ["Hotel Restaurant"],
      originalPrice: null,
      discountedPrice: null,
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Deals', icon: <FaTag /> },
    { id: 'food', name: 'Food Discounts', icon: <FaTag /> }
  ];

  const filteredDeals = selectedCategory === 'all' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory);

  const featuredDeals = deals.filter(deal => deal.featured);

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
          <h2>Food Discount Deals</h2>
          <div className="featured-deals-grid">
            {featuredDeals.map(deal => (
              <div key={deal.id} className="featured-deal-card">
                <div className="deal-badge">{deal.discount}</div>
                <div className="deal-content">
                  <h3 style={{color: '#222', fontWeight: 'bold'}}>{deal.title}</h3>
                  <p style={{color: '#222', fontSize: '1.1em'}}>{deal.description}</p>
                  <div className="deal-destinations" style={{color: '#222'}}>
                    <FaMapMarkerAlt />
                    {deal.destinations.join(', ')}
                  </div>
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
                <div className="deal-badge">{deal.discount}</div>
                <div className="deal-content">
                  <h3 style={{color: '#222', fontWeight: 'bold'}}>{deal.title}</h3>
                  <p style={{color: '#222', fontSize: '1.1em'}}>{deal.description}</p>
                  <div className="deal-details">
                    <div className="deal-destinations" style={{color: '#222'}}>
                      <FaMapMarkerAlt />
                      {deal.destinations.join(', ')}
                    </div>
                  </div>
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
