import { useState } from 'react';
import { FaClock, FaCoffee, FaFire, FaLeaf, FaMugHot, FaSnowflake, FaUsers, FaUtensils } from 'react-icons/fa';
import './RestaurantPage.css';

const RestaurantPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: <FaUtensils /> },
    { id: 'breakfast', name: 'Breakfast', icon: <FaCoffee /> },
    { id: 'soup', name: 'Soup', icon: <FaMugHot /> },
    { id: 'desi', name: 'Desi Food', icon: <FaLeaf /> },
    { id: 'chinese', name: 'Chinese', icon: <FaSnowflake /> },
    { id: 'fried', name: 'Fried Items', icon: <FaFire /> },
    { id: 'lunch', name: 'Lunch & Dinner', icon: <FaClock /> }
  ];

  const menuItems = [
    // Breakfast Menu
    { id: 1, name: 'Special Tea', category: 'breakfast', image: 'assets/resturant/Breakfast/tea.jpg', description: 'Traditional Pakistani tea brewed with milk and spices.' },
    { id: 2, name: 'Pratha + Single Omelet + Tea', category: 'breakfast', image: 'assets/resturant/Breakfast/andapratha.jpg', description: 'Crispy paratha served with a fluffy omelet and hot tea.' },
    { id: 3, name: 'Slice + Butter + Jam + Tea', category: 'breakfast', image: 'assets/resturant/Breakfast/toastbread.jpg', description: 'Fresh bread slices with creamy butter, sweet jam, and tea.' },
    { id: 4, name: '3 Giyalching + Desi Butter + Tea', category: 'breakfast', image: 'assets/resturant/Breakfast/Giyalching.jpg', description: 'Local specialty bread served with homemade butter and tea.' },
    { id: 5, name: 'Tikki (Desi Bread) + Desi Egg + Tea', category: 'breakfast', image: 'assets/resturant/Breakfast/Tikki.jpg', description: 'Desi bread paired with farm-fresh eggs and tea.' },
    { id: 6, name: 'Desi Butter + Desi Naan + Tea', category: 'breakfast', image: 'assets/resturant/Breakfast/desibutter.jpg', description: 'Soft naan with homemade butter and a cup of tea.' },
    // Soup
    { id: 7, name: 'Chicken Soup', category: 'soup', image: 'assets/resturant/Soup/ChickenSoup.jpg', description: 'Classic chicken soup with tender pieces and rich broth.' },
    { id: 8, name: 'Mix Veg Soup', category: 'soup', image: 'assets/resturant/Soup/VegSoup.jpg', description: 'A blend of fresh vegetables simmered in savory broth.' },
    { id: 9, name: 'Hot And Sour Soup', category: 'soup', image: 'assets/resturant/Soup/HotSoup.jpg', description: 'Spicy and tangy soup with chicken and vegetables.' },
    { id: 10, name: 'Desi Dowdow', category: 'soup', image: 'assets/resturant/Soup/Daodaosoup.jpg', description: 'Traditional local soup made with seasonal ingredients.' },
    // Desi Food
    { id: 11, name: 'Desi Mulda + Milk + Desi Butter', category: 'desi', image: 'assets/resturant/DesiFood/Mulda.jpg', description: 'Mulda bread served with fresh milk and homemade butter.' },
    { id: 12, name: 'Desi Lajek with Mutton', category: 'desi', image: 'assets/resturant/DesiFood/LajekMutton.jpg', description: 'Traditional Lajek bread served with spicy mutton curry.' },
    { id: 13, name: 'Desi Lajek with Chicken', category: 'desi', image: 'assets/resturant/DesiFood/LajekChicken.jpg', description: 'Lajek bread paired with flavorful chicken curry.' },
    // Chinese
    { id: 14, name: 'Chicken Chawmin', category: 'chinese', image: 'assets/resturant/Chinese/ChickenChowMen.jpg', description: 'Stir-fried noodles with chicken and vegetables.' },
    { id: 15, name: 'Chicken Manchurian', category: 'chinese', image: 'assets/resturant/Chinese/ChickenManchurian.jpg', description: 'Crispy chicken balls tossed in tangy Manchurian sauce.' },
    { id: 16, name: 'Veg Chawmin', category: 'chinese', image: 'assets/resturant/Chinese/VegChawmin.jpg', description: 'Vegetarian noodles stir-fried with fresh veggies.' },
    { id: 17, name: 'Chicken Mecrony', category: 'chinese', image: 'assets/resturant/Chinese/ChickenMacaroni.jpg', description: 'Macaroni pasta cooked with chicken in Chinese spices.' },
    // Fried Items
    { id: 18, name: 'Fried Fish', category: 'fried', image: 'assets/resturant/FriedItems/FriedFish.jpg', description: 'Golden fried fish fillets with crispy coating.' },
    { id: 19, name: 'Masala Fish', category: 'fried', image: 'assets/resturant/FriedItems/MasalaFish.jpg', description: 'Fish fillets marinated in spicy masala and fried.' },
    { id: 20, name: 'French Fries Large', category: 'fried', image: 'assets/resturant/FriedItems/FrenchFries.jpg', description: 'Large portion of crispy golden fries.' },
    { id: 21, name: 'Chicken Roast', category: 'fried', image: 'assets/resturant/FriedItems/ChickenRoast.jpg', description: 'Juicy roasted chicken with aromatic spices.' },
    // Lunch and Dinner
    { id: 22, name: 'Chicken Karahi', category: 'lunch', image: 'assets/resturant/LunchnDinner/Chickenkarahi.jpg', description: 'Traditional chicken karahi cooked in tomato gravy.' },
    { id: 23, name: 'Chicken White Karahi', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenWhiteKarahi.jpg', description: 'Chicken karahi in a creamy white sauce.' },
    { id: 24, name: 'Chicken Handi', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenHandi.jpg', description: 'Chicken cooked in a traditional handi with spices.' },
    { id: 25, name: 'Chicken Haleem', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenHaleem.jpg', description: 'Slow-cooked chicken haleem with lentils and wheat.' },
    { id: 26, name: 'Chicken Nihari Per Head', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenNihari.jpg', description: 'Rich and spicy chicken nihari served per head.' },
    { id: 27, name: 'Chicken Qorma Per Head', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenQorma.jpg', description: 'Chicken cooked in creamy qorma gravy.' },
    { id: 28, name: 'Mutton Karahi', category: 'lunch', image: 'assets/resturant/LunchnDinner/MuttonKarahi.jpg', description: 'Spicy mutton karahi with tomatoes and green chilies.' },
    { id: 29, name: 'Mutton Handi', category: 'lunch', image: 'assets/resturant/LunchnDinner/MuttonHandi.jpg', description: 'Mutton cooked in handi with aromatic spices.' },
    { id: 30, name: 'Mutton White Handi', category: 'lunch', image: 'assets/resturant/LunchnDinner/MuttonWhiteHandi.jpg', description: 'Creamy mutton handi with mild spices.' },
    { id: 31, name: 'Mutton Namkeen', category: 'lunch', image: 'assets/resturant/LunchnDinner/MuttonNamkeen.jpg', description: 'Salted mutton cooked in traditional style.' },
    { id: 32, name: 'Nehari', category: 'lunch', image: 'assets/resturant/LunchnDinner/Nehari.jpg', description: 'Slow-cooked beef stew with spices.' },
    { id: 33, name: 'Chicken Polao', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenPulao.jpg', description: 'Aromatic rice cooked with chicken and spices.' },
    { id: 34, name: 'Chicken Biryani', category: 'lunch', image: 'assets/resturant/LunchnDinner/ChickenBiryani.jpg', description: 'Classic biryani with chicken and fragrant rice.' },
    { id: 35, name: 'Mutton Biryani', category: 'lunch', image: 'assets/resturant/LunchnDinner/muttonbiryani.jpg', description: 'Biryani rice layered with spicy mutton.' },
    { id: 36, name: 'Beef Biryani', category: 'lunch', image: 'assets/resturant/LunchnDinner/BeefBiryani.jpg', description: 'Biryani rice layered with tender beef.' },
    { id: 37, name: 'White Rice', category: 'lunch', image: 'assets/resturant/LunchnDinner/WhiteRice.jpg', description: 'Steamed white rice, perfect as a side.' },
    { id: 38, name: 'Brown Rice', category: 'lunch', image: 'assets/resturant/LunchnDinner/BrownRice.jpg', description: 'Nutritious brown rice, healthy and filling.' },
    { id: 39, name: 'Fried Rice', category: 'lunch', image: 'assets/resturant/LunchnDinner/FriedRice.jpg', description: 'Rice stir-fried with vegetables and spices.' },
    { id: 40, name: 'Veg Rice', category: 'lunch', image: 'assets/resturant/LunchnDinner/VegRice.jpg', description: 'Rice cooked with assorted vegetables.' },
    { id: 41, name: 'Mix Vegetable (Large Bowl)', category: 'lunch', image: 'assets/resturant/LunchnDinner/MixedVegetable.jpg', description: 'A mix of seasonal vegetables cooked in spices.' },
    { id: 42, name: 'Desi Vegetable (Large Bowl)', category: 'lunch', image: 'assets/resturant/LunchnDinner/DesiVegetable.jpg', description: 'Traditional desi vegetables cooked in local style.' },
    { id: 43, name: 'Daal Mash (Large Bowl)', category: 'lunch', image: 'assets/resturant/LunchnDinner/mash.jpg', description: 'Mash daal cooked with spices and herbs.' },
    { id: 44, name: 'Anda Chola (Large Bowl)', category: 'lunch', image: 'assets/resturant/LunchnDinner/AndaCholay.jpg', description: 'Eggs and chickpeas cooked in spicy gravy.' },
    { id: 45, name: 'Daal Channa (Large Bowl)', category: 'lunch', image: 'assets/resturant/LunchnDinner/DaalChanna.jpg', description: 'Channa daal cooked with traditional spices.' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const restaurantFeatures = [
    {
      icon: <FaUtensils />,
      title: 'Fine Dining',
      description: 'Starred chef with international cuisine'
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
                Experience world-class cuisine crafted by our starred chef, featuring locally sourced ingredients and innovative techniques.
              </p>
             
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
            {/* Render menu items grouped by category with headings */}
            {categories.filter(cat => cat.id !== 'all').map(cat => {
              const items = filteredItems.filter(item => item.category === cat.id);
              if (items.length === 0) return null;
              return (
                <div key={cat.id} className="menu-category">
                  <h4 className="category-title">{cat.name}</h4>
                  <div className="menu-items">
                    {items.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-content">
                        <div className="menu-item-image-container">
                          <img src={item.image} alt={item.name} className="menu-item-image" />
                        </div>
                        <h3 className="menu-item-name">{item.name}</h3>
                        <p className="menu-item-description">{item.description}</p>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reservation Section Removed as requested. All tags closed properly. */}
    </div>
  );
};

export default RestaurantPage;
