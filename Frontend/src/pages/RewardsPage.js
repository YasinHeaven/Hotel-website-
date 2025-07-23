import { useState } from 'react';
import { FaArrowRight, FaAward, FaChartLine, FaCheckCircle, FaCrown, FaEnvelope, FaGift, FaHeart, FaPhone, FaStar } from 'react-icons/fa';
import './RewardsPage.css';

const RewardsPage = () => {
  const [membershipData, setMembershipData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    preferredHotel: '',
    communicationPreference: 'email'
  });

  const handleInputChange = (e) => {
    setMembershipData({
      ...membershipData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Rewards signup:', membershipData);
    alert(`Welcome to Heaven Rewards, ${membershipData.firstName}!\n\nYour account has been created successfully. You'll receive a welcome email with your member number and bonus points.\n\nStart earning points with your next stay!`);
  };

  const tiers = [
    {
      name: 'Silver',
      icon: <FaStar />,
      color: '#94a3b8',
      minStays: 0,
      minNights: 0,
      benefits: [
        'Earn 10 points per $1 spent',
        'Free Wi-Fi',
        'Mobile check-in',
        'Member rates',
        'Welcome drink'
      ]
    },
    {
      name: 'Gold',
      icon: <FaGift />,
      color: '#fbbf24',
      minStays: 10,
      minNights: 25,
      benefits: [
        'Earn 12 points per $1 spent',
        'Room upgrades (subject to availability)',
        'Late checkout until 2 PM',
        'Complimentary breakfast',
        'Priority reservations',
        'All Silver benefits'
      ]
    },
    {
      name: 'Platinum',
      icon: <FaCrown />,
      color: '#8b5cf6',
      minStays: 25,
      minNights: 50,
      benefits: [
        'Earn 15 points per $1 spent',
        'Guaranteed room upgrades',
        'Late checkout until 4 PM',
        'Executive lounge access',
        'Complimentary spa credit',
        'Personal concierge',
        'All Gold benefits'
      ]
    }
  ];

  const rewardOptions = [
    {
      category: 'Hotel Stays',
      items: [
        { name: 'Free Night (Standard Room)', points: 15000, image: '/assets/Single Bed Pic.jpg' },
        { name: 'Free Night (Deluxe Room)', points: 20000, image: '/assets/Washroom Dulex.jpg' },
        { name: 'Free Night (Suite)', points: 35000, image: '/assets/Master .jpg' },
        { name: 'Weekend Getaway Package', points: 45000, image: '/assets/View.jpg' }
      ]
    },
    {
      category: 'Dining',
      items: [
        { name: 'Restaurant Dining Credit ($50)', points: 5000, image: '/assets/T1.jpg' },
        { name: 'Restaurant Dining Credit ($100)', points: 9000, image: '/assets/T2.jpg' },
        { name: 'Chef\'s Table Experience', points: 15000, image: '/assets/Home 1.jpg' },
        { name: 'Wine Tasting Experience', points: 8000, image: '/assets/Home 2.jpg' }
      ]
    },
    {
      category: 'Spa & Wellness',
      items: [
        { name: 'Spa Treatment ($75)', points: 7500, image: '/assets/home 3.jpg' },
        { name: 'Spa Treatment ($150)', points: 14000, image: '/assets/Single Bed Close.jpg' },
        { name: 'Spa Day Package', points: 25000, image: '/assets/Washroom Dulex close.jpg' },
        { name: 'Wellness Weekend', points: 40000, image: '/assets/Master Bed .mp4.jpg' }
      ]
    },
    {
      category: 'Travel',
      items: [
        { name: 'Airport Transfer', points: 3000, image: '/assets/Home 1.jpg' },
        { name: 'Car Rental Discount', points: 2000, image: '/assets/Home 2.jpg' },
        { name: 'Flight Discount ($200)', points: 18000, image: '/assets/home 3.jpg' },
        { name: 'Travel Insurance', points: 5000, image: '/assets/View.jpg' }
      ]
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('Hotel Stays');

  const benefits = [
    {
      icon: <FaChartLine />,
      title: 'Earn Points Fast',
      description: 'Earn points on every dollar spent on rooms, dining, spa, and more'
    },
    {
      icon: <FaAward />,
      title: 'Exclusive Perks',
      description: 'Enjoy member-only rates, room upgrades, and priority services'
    },
    {
      icon: <FaHeart />,
      title: 'Personalized Service',
      description: 'Receive tailored recommendations and dedicated support'
    },
    {
      icon: <FaGift />,
      title: 'Flexible Rewards',
      description: 'Redeem points for stays, dining, experiences, and more'
    }
  ];

  return (
    <div className="rewards-page">
      {/* Hero Section */}
      <section className="rewards-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="rewards-hero-content">
          <div className="container">
            <div className="rewards-hero-text">
              <div className="hero-badge">
                🌟 Heaven Rewards Program
              </div>
              <h1 className="hero-title">
                Earn More, <span className="hero-highlight">Experience More</span>
              </h1>
              <p className="hero-description">
                Join Heaven Rewards and unlock exclusive benefits, earn points on every stay, and enjoy personalized experiences at Yasin Heaven Star Hotel.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50,000+</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat">
                  <div className="stat-number">1M+</div>
                  <div className="stat-label">Points Earned</div>
                </div>
                <div className="stat">
                  <div className="stat-number">15,000+</div>
                  <div className="stat-label">Rewards Redeemed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why Join Heaven Rewards?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="tiers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Membership Tiers</h2>
            <p className="section-description">
              Advance through our three exclusive tiers and unlock increasingly valuable benefits
            </p>
          </div>
          <div className="tiers-grid">
            {tiers.map((tier, index) => (
              <div key={index} className="tier-card">
                <div className="tier-header" style={{ backgroundColor: tier.color }}>
                  <div className="tier-icon">{tier.icon}</div>
                  <h3 className="tier-name">{tier.name}</h3>
                </div>
                <div className="tier-content">
                  <div className="tier-requirements">
                    <div className="requirement">
                      <span className="requirement-value">{tier.minStays}+</span>
                      <span className="requirement-label">Qualifying Stays</span>
                    </div>
                    <div className="requirement">
                      <span className="requirement-value">{tier.minNights}+</span>
                      <span className="requirement-label">Qualifying Nights</span>
                    </div>
                  </div>
                  <ul className="tier-benefits">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="tier-benefit">
                        <FaCheckCircle className="check-icon" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="rewards-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Redeem Your Points</h2>
            <p className="section-description">
              Choose from a variety of rewards and experiences to make your points work for you
            </p>
          </div>
          
          <div className="rewards-categories">
            {rewardOptions.map((category) => (
              <button
                key={category.category}
                className={`category-btn ${selectedCategory === category.category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.category)}
              >
                {category.category}
              </button>
            ))}
          </div>
          
          <div className="rewards-grid">
            {rewardOptions
              .find(cat => cat.category === selectedCategory)
              ?.items.map((item, index) => (
                <div key={index} className="reward-card">
                  <div className="reward-image">
                    <img src={item.image} alt={item.name} />
                    <div className="reward-points">
                      {item.points.toLocaleString()} pts
                    </div>
                  </div>
                  <div className="reward-content">
                    <h3 className="reward-name">{item.name}</h3>
                    <button className="btn btn-primary">
                      Redeem Now
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="signup-section">
        <div className="container">
          <div className="signup-content">
            <div className="signup-info">
              <h2 className="signup-title">Join Heaven Rewards Today</h2>
              <p className="signup-description">
                Start earning points immediately and enjoy exclusive member benefits from day one. It's free to join and takes just a few minutes.
              </p>
              <div className="signup-benefits">
                <div className="signup-benefit">
                  <FaCheckCircle className="check-icon" />
                  <span>Free to join</span>
                </div>
                <div className="signup-benefit">
                  <FaCheckCircle className="check-icon" />
                  <span>Instant member rates</span>
                </div>
                <div className="signup-benefit">
                  <FaCheckCircle className="check-icon" />
                  <span>500 bonus points on signup</span>
                </div>
                <div className="signup-benefit">
                  <FaCheckCircle className="check-icon" />
                  <span>Points never expire</span>
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>(800) 123-4567</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>rewards@yasinheaven.com</span>
                </div>
              </div>
            </div>
            
            <form className="signup-form" onSubmit={handleSignUp}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={membershipData.firstName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={membershipData.lastName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={membershipData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={membershipData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birthDate">Birth Date</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={membershipData.birthDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="preferredHotel">Preferred Hotel Location</label>
                <select
                  id="preferredHotel"
                  name="preferredHotel"
                  value={membershipData.preferredHotel}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select a location</option>
                  <option value="downtown">Downtown Location</option>
                  <option value="airport">Airport Location</option>
                  <option value="beachfront">Beachfront Location</option>
                  <option value="mountain">Mountain Resort</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Communication Preference</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="communicationPreference"
                      value="email"
                      checked={membershipData.communicationPreference === 'email'}
                      onChange={handleInputChange}
                    />
                    Email
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="communicationPreference"
                      value="sms"
                      checked={membershipData.communicationPreference === 'sms'}
                      onChange={handleInputChange}
                    />
                    SMS
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="communicationPreference"
                      value="both"
                      checked={membershipData.communicationPreference === 'both'}
                      onChange={handleInputChange}
                    />
                    Both
                  </label>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-large">
                Join Heaven Rewards
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RewardsPage;
