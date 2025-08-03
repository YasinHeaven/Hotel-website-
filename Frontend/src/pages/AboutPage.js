import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">About Us</h1>
            <span className="hero-subtitle">A brief history about Yasin Heaven Star Hotel</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-main-content">
        <div className="container">
          
          {/* Our Journey Section */}
          <section className="our-journey">
            <div className="journey-badge">Our Journey</div>
            <h2 className="section-title">Yasin Heaven Star Hotel</h2>
            <div className="journey-content">
              <div className="journey-text">
                <p className="journey-description">
                  Yasin heaven star hotel is the most famous and favorite tourist destination in Yasin valley 
                  Gilgit baltistan district ghizer. We started in 2022 with the capacity of 10 rooms with 
                  private bathrooms, a big restaurant and conference room.
                </p>
                <p className="journey-additional">
                  We are committed to providing exceptional hospitality and creating unforgettable memories 
                  for our guests in the breathtaking landscape of Yasin Valley.
                </p>
              </div>
              <div className="journey-image">
                <img 
                  src="/assets/about/about2.jpg" 
                  alt="Yasin Heaven Star Hotel" 
                  className="about-main-image"
                />
              </div>
            </div>
          </section>

          {/* Board of Directors Section */}
          <section className="board-of-directors">
            <h2 className="section-title">Board of Directors</h2>
            <div className="directors-grid">
              
              <div className="director-card">
                <div className="director-image">
                  <img 
                    src="/assets/members/Shamsherali.jpg" 
                    alt="Shamsher Ali" 
                    className="director-photo"
                  />
                </div>
                <div className="director-info">
                  <h3 className="director-name">Shamsher Ali</h3>
                  <p className="director-title">Executive Director</p>
                </div>
              </div>

              <div className="director-card">
                <div className="director-image">
                  <img 
                    src="/assets/members/Qurbanali.jpg" 
                    alt="Qurban Ali" 
                    className="director-photo"
                  />
                </div>
                <div className="director-info">
                  <h3 className="director-name">Qurban Ali</h3>
                  <p className="director-title">Director</p>
                </div>
              </div>

              <div className="director-card">
                <div className="director-image">
                  <img 
                    src="/assets/members/Mehrbanali.jpg" 
                    alt="Meharban Ali" 
                    className="director-photo"
                  />
                </div>
                <div className="director-info">
                  <h3 className="director-name">Meharban Ali</h3>
                  <p className="director-title">Director</p>
                </div>
              </div>

              <div className="director-card">
                <div className="director-image">
                  <img 
                    src="/assets/members/Shabanali.jpg" 
                    alt="Shaban Ali" 
                    className="director-photo"
                  />
                </div>
                <div className="director-info">
                  <h3 className="director-name">Shaban Ali</h3>
                  <p className="director-title">Director</p>
                </div>
              </div>

            </div>
          </section>

          {/* Features Section */}
          <section className="about-features">
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🏨</div>
                <h3>Premium Accommodation</h3>
                <p>10 comfortable rooms with private bathrooms and modern amenities</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🍽️</div>
                <h3>Restaurant & Dining</h3>
                <p>Big restaurant serving delicious local and international cuisine</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🏢</div>
                <h3>Conference Facilities</h3>
                <p>Well-equipped conference room for meetings and events</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🏔️</div>
                <h3>Scenic Location</h3>
                <p>Located in the heart of beautiful Yasin Valley, Gilgit Baltistan</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
