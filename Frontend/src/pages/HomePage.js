import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useState } from "react";
import { FaArrowRight, FaCar, FaCheckCircle, FaConciergeBell, FaMapMarkerAlt, FaShoppingBag, FaShower, FaStar, FaUtensils, FaWhatsapp, FaWifi } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';
import { createImageErrorHandler, getAssetPath } from '../utils/assetUtils';
import './HomePage.css';
import './RoomsPage.css';
// GallerySliderModal component (must be outside HomePage)
function GallerySliderModal({ images, title, onClose }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;
  const prevImg = () => setCurrent((current - 1 + images.length) % images.length);
  const nextImg = () => setCurrent((current + 1) % images.length);
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
      padding: '32px',
      maxWidth: '700px',
      width: '90%',
      zIndex: 9999
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>{title} Gallery</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <button onClick={prevImg} style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', color: '#333' }} disabled={images.length <= 1}>&lt;</button>
        <img src={images[current]} alt={`Gallery ${current+1}`} style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        <button onClick={nextImg} style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', color: '#333' }} disabled={images.length <= 1}>&gt;</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px', color: '#555' }}>
        {current + 1} / {images.length}
      </div>
    </div>
  );
}



// Move facilities array definition to the top, before any useState calls
const facilities = [
  {
    icon: <FaCar />, // Parking
    name: 'Safe & Secure Parking',
    description: 'We offer dedicated parking space for up to 50 vehicles so you never have to worry about finding a spot. Our main parking area is conveniently located right next to the hotel’s front gate, while space for larger vehicles is just a short walk away. Whether you\'re arriving by car, van, or tour bus, your ride is safe with us.',
    images: [
      '/assets/Facilities/Parking/Parking.jpg',
    ],
    },
    {
    icon: <FaWifi />, // Wi-Fi
    name: 'Fast & Reliable Wi-Fi',
    description: 'Stay connected with our high-speed internet available 24/7 throughout the hotel. Whether you\'re working, video calling loved ones, or streaming your favorite shows we’ve got you covered with smooth, uninterrupted access.',
    images: ['/assets/Facilities/wifi/wifi.jpg'],
  },
  {
    icon: <FaShoppingBag />, // Gift Shop
    name: 'Charming Gift Shop',
    description: 'Take a piece of Yasin home with you! Our gift shop offers a delightful selection of local crafts, souvenirs, and travel essentials. Whether you\'re picking up a keepsake or finding the perfect gift, you’ll discover something unique to remember your stay by. And for a touch of color, visit our Bouquet Corner.',
    images: [
      getAssetPath('Home 1.jpg', 'homepage'), // Placeholder until gift shop image is available
    ],
  },
  {
    icon: <FaStar />, // Power Supply
    name: 'Uninterrupted Power Supply',
    description: 'Enjoy round-the-clock electricity during your stay! Due to the location of main powerhouse in Yasin Ghizer, our hotel provides reliable 24/7 lighting so you\'re never left in the dark, whether it’s for work, relaxation, or planning your next adventure.',
    images: ['/assets/Facilities/elecriticity/electric.jpg'],
  },
  {
    icon: <FaShower />, // Water/Showers
    name: 'Refreshing Glacier Water & Soothing Hot Showers',
    description: 'At Yasin Heaven Star Hotel, every room is equipped with both hot and cold water, perfect for unwinding after a day of adventure. Our cold water flows fresh from nearby glacier-fed sources, offering a crisp and rejuvenating experience, while our hot water is always ready to warm you up in comfort.',
    images: ['/assets/Facilities/showers/hotshowers.jpg'],
  },
  {
    icon: <FaCheckCircle />, // Security
    name: '24/7 Security',
    description: 'Your Safety Comes Firs.  At Yasin Heaven Star Hotel, we prioritize your peace of mind. Our premises are safe and secure, with attentive staff and protective measures in place 24/7 so you can relax, explore, and enjoy your stay without worry.',
    images: [
  '/assets/Facilities/security/security.jpg',
],
  },
];


const HomePage = () => {
  const navigate = useNavigate();
  
  // Slideshow images
  const slideImages = [
    '/assets/SlideShow/slide1.jpg',
    '/assets/SlideShow/slide2.jpg',
    '/assets/SlideShow/slide3.jpg',
    '/assets/SlideShow/slide4.jpg',
    '/assets/SlideShow/slide5.jpg'
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [facilityImgIndexes, setFacilityImgIndexes] = useState(() => facilities.map(() => 0));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [slideImages.length]);

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

  // Updated functions for button interactions using React Router
  // Gallery modal state for Popular Destinations
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');

  const handleOpenGallery = (type) => {
    let images = [];
    let title = '';
    if (type === 'CityHotels') {
      images = [
        '/assets/PopularDestinations/CityHotels/1.jpg',
        '/assets/PopularDestinations/CityHotels/2.jpg',
        '/assets/PopularDestinations/CityHotels/3.jpg',
        '/assets/PopularDestinations/CityHotels/4.jpg',
        '/assets/PopularDestinations/CityHotels/5.jpg',
        '/assets/PopularDestinations/CityHotels/homepage.jpg',
      ].map(img => process.env.PUBLIC_URL + img);
      title = 'City Hotels';
    } else if (type === 'MountainResort') {
      images = [
        '/assets/PopularDestinations/MountainResort/1.jpg',
        '/assets/PopularDestinations/MountainResort/2.jpg',
        '/assets/PopularDestinations/MountainResort/3.jpg',
        '/assets/PopularDestinations/MountainResort/4.jpg',
        '/assets/PopularDestinations/MountainResort/5.jpg',
        '/assets/PopularDestinations/MountainResort/6.jpg',
        '/assets/PopularDestinations/MountainResort/7.jpg',
        '/assets/PopularDestinations/MountainResort/homepage.jpg',
      ].map(img => process.env.PUBLIC_URL + img);
      title = 'Mountain Resort';
    }
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
    setGalleryImages([]);
    setGalleryTitle('');
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

  const handleViewFullMenu = () => {
    navigate('/restaurant');
  };

  return (
    <div className="home-page" style={{ position: 'relative' }}>
      {/* Floating WhatsApp Chat Button */}
      <a
        href="https://wa.me/923554650686"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#25d366',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          transition: 'background 0.2s',
        }}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp style={{ color: '#fff', fontSize: '2rem' }} />
      </a>
      {/* Hero Section with Slideshow */}
      <section className="hero-section">
        <div className="slideshow-container">
          {slideImages.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="container">
              <div className="hero-text">
                <div className="hero-badge">
                  ⭐ Premium Hotel Experience
                </div>
                <h1 className="hero-title">
                  Welcome to <span className="hero-title-gradient">Yasin Heaven Star Hotel</span>
                  <br />
                </h1>
                <p className="hero-description">
                  Discover luxury hotels and unforgettable experiences worldwide. Your perfect stay awaits.
                </p>
              </div>
            </div>
          </div>
          
          {/* Slideshow navigation dots */}
          <div className="slideshow-dots">
            {slideImages.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Rooms Gallery (users can only view, not book from here) */}
      <section className="rooms-gallery-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Our Rooms</h2>
          <div className="rooms-gallery" style={{ display: 'flex', flexDirection: 'row', gap: '24px', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {/* Static room cards for homepage only */}
            {[
              {
                id: 'static-single',
                name: 'Single Room',
                image: getAssetPath('Single_Room_1.jpg', 'room'),
              },
              {
                id: 'static-deluxe',
                name: 'Deluxe Room',
                image: getAssetPath('Delux_Room_1.jpg', 'room'),
              },
              {
                id: 'static-family',
                name: 'Family Room',
                image: getAssetPath('Family_room_1.jpg', 'room'),
              },
              {
                id: 'static-master',
                name: 'Master Room',
                image: getAssetPath('Master_Room_1.jpg', 'room'),
              },
            ].map((room) => (
              <div key={room.id} className="gallery-item" onClick={() => navigate('/rooms')} style={{ width: '220px', height: '220px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="gallery-img" 
                  style={{ 
                    width: '100%', 
                    height: '70%', 
                    objectFit: 'cover', 
                    borderRadius: '14px 14px 0 0', 
                    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
                    transition: 'transform 0.2s',
                  }} 
                  onError={createImageErrorHandler('room')}
                />
                <div 
                  className="gallery-overlay" 
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    background: 'rgba(255,255,255,0.95)', 
                    borderRadius: '0 0 16px 16px', 
                    boxShadow: '0 -2px 8px rgba(0,0,0,0.04)', 
                    padding: '12px 0', 
                    textAlign: 'center', 
                    transition: 'background 0.2s',
                  }}
                >
                  <h3 
                    className="gallery-title" 
                    style={{ 
                      margin: 0, 
                      fontSize: '1.15rem', 
                      fontWeight: 700, 
                      color: '#222',
                      letterSpacing: '0.5px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.07)',
                    }}
                  >
                    {room.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ...other homepage sections (about, location, destinations, etc.) ... */}

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
               <img src="/assets/Homepage/Home1.jpg" alt="Home1" />
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

      {/* Popular Destinations Section (moved to top) */}
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
        <div className="destination-card" onClick={() => handleOpenGallery('CityHotels')}>
          <div className="destination-image">
            <img 
              src="/assets/PopularDestinations/CityHotels/homepage.jpg" 
              alt="City Hotels"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
            />
            <div className="destination-overlay">
              <div className="destination-badge city">🏙️ City</div>
            </div>
          </div>
        </div>
        <div className="destination-card" onClick={() => handleOpenGallery('MountainResort')}>
          <div className="destination-image">
            <img 
              src="/assets/PopularDestinations/MountainResort/homepage.jpg" 
              alt="Mountain Resorts"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
            />
            <div className="destination-overlay">
              <div className="destination-badge mountain">🏔️ Mountain</div>
            </div>
          </div>
        </div>
      </div>
        </div>
        {/* Gallery Modal */}
        <Modal open={galleryOpen} onClose={handleCloseGallery}>
          <GallerySliderModal 
            images={galleryImages} 
            title={galleryTitle} 
            onClose={handleCloseGallery} 
          />
        </Modal>
      </section>
      
      {/* Restaurant Section */}
      <section className="section restaurant-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              🍽️ Fine Dining
            </div>
            <h2 className="section-title">Restaurant</h2>
            <p className="section-description">
              Experience culinary excellence with our award-winning restaurant
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
                    <FaConciergeBell className="feature-icon" />
                    <span>Room Service Available</span>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="menu-preview">
              <h3>Menu Highlights</h3>
              {/* Updated menu highlights to match restaurant screen */}
              <div className="menu-category">
                <h4 className="category-title">Breakfast</h4>
                <div className="menu-items">
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Special Tea</h5><p className="item-description">Fresh pastries, fruits, coffee, and juice</p></div></div>
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Tikki (Desi Bread) + Desi Egg + Tea</h5><p className="item-description">Eggs, bacon, sausages, beans, toast, and coffee</p></div></div>
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Slice + Butter + Jam + Tea</h5><p className="item-description">Granola, yogurt, fresh berries, and honey</p></div></div>
                </div>
              </div>
              <div className="menu-category">
                <h4 className="category-title">Lunch & Dinner</h4>
                <div className="menu-items">
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Chicken Karahi</h5><p className="item-description">Fresh Atlantic salmon with vegetables</p></div></div>
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Chicken Qorma</h5><p className="item-description">Premium cut with truffle sauce</p></div></div>
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Vegetarian Rice</h5><p className="item-description">Fresh pasta with seasonal vegetables</p></div></div>
                  <div className="menu-item"><div className="item-info"><h5 className="item-name">Anda Chola (Large Bowl)</h5><p className="item-description">Daily special created by our head chef</p></div></div>
                </div>
              </div>
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
                        <img 
                          src={facility.images[currentImg]} 
                          alt={facility.name + ' ' + (currentImg + 1)} 
                          className="facility-gallery-img"
                          onError={createImageErrorHandler('facility')}
                        />
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

      {/* Reviews Section */}
      <ReviewsSection />

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
                    <p><strong>⏰ Booked At:</strong> {bookingSuccess.bookingTime ? new Date(bookingSuccess.bookingTime).toLocaleString() : ''}</p>
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
