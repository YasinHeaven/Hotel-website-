// Asset path mapping utility for Yasin Heaven Star Hotel
// Maps incorrect asset references to correct folder structure paths

export const assetPathMap = {
  // Homepage assets
  'Home 1.jpg': '/assets/Homepage/Home 1.jpg',
  'Home 2.jpg': '/assets/Homepage/Home 2.jpg',
  'home 3.jpg': '/assets/Homepage/home 3.jpg',
  'View.jpg': '/assets/Homepage/View.jpg',
  
  // Room assets
  'Single_Room_1.jpg': '/assets/Rooms/Single_Room_1.jpg',
  'Single_Room_2.jpg': '/assets/Rooms/Single_Room_2.jpg',
  'Delux_Room_1.jpg': '/assets/Rooms/Delux_Room_1.jpg',
  'Delux_Room_2.jpg': '/assets/Rooms/Delux_Room_2.jpg',
  'Master_Room_1.jpg': '/assets/Rooms/Master_Room_1.jpg',
  'Master_Room_2.jpg': '/assets/Rooms/Master_Room_2.jpg',
  'Family_room_1.jpg': '/assets/Rooms/Family_room_1.jpg',
  'Family_room_2.jpg': '/assets/Rooms/Family_room_2.jpg',
  'Washroom Dulex.jpg': '/assets/Rooms/Washroom Dulex.jpg',
  'Washroom Dulex close.jpg': '/assets/Rooms/Washroom Dulex close.jpg',
  'Single Bed Pic.jpg': '/assets/Rooms/Single Room 1.jpg', // Mapping to existing room image
  'Single Bed Close.jpg': '/assets/Rooms/Single Room 2.jpg', // Mapping to existing room image
  'Master .jpg': '/assets/Rooms/Master Room 1.jpg', // Mapping to existing room image
  'Master Bed .mp4.jpg': '/assets/Rooms/Master Room 2.jpg', // Mapping to existing room image
  
  // Logo assets
  'logo.jpg': '/assets/Logo/logo.jpg',
  
  // Restaurant assets - mapping to available restaurant images
  'T1.jpg': '/assets/Resturent/Chicken karahi 😍.jpg',
  'T2.jpg': '/assets/Resturent/Hyderabadi biryani recipe _ How to make hyderabadi biryani.jpg',
  
  // Facilities assets
  'Parking 1.jpg': '/assets/Facilities/Parking/Parking 1.jpg',
  'Parking 2.jpg': '/assets/Facilities/Parking/Parking 2.jpg',
  'Parking 3.jpg': '/assets/Facilities/Parking/Parking 3.jpg',
  'Conference room.jpg': '/assets/Facilities/Conference Room/Conference room.jpg',
  'Rent car 1.jpg': '/assets/Facilities/Rent a car Service/Rent car 1.jpg',
  'Rent car 2.jpg': '/assets/Facilities/Rent a car Service/Rent car 2.jpg',
  
  // Gallery assets
  '1.jpg': '/assets/Gallery/1.jpg',
  '2.jpg': '/assets/Gallery/2.jpg',
  '3.jpg': '/assets/Gallery/3.jpg',
  '4.jpg': '/assets/Gallery/4.jpg',
  '5.jpg': '/assets/Gallery/5.jpg',
  '6.jpg': '/assets/Gallery/6.jpg',
  '7.jpg': '/assets/Gallery/7.jpg',
  '8.jpg': '/assets/Gallery/8.jpg',
  '9.jpg': '/assets/Gallery/9.jpg',
  '10.jpg': '/assets/Gallery/10.jpg',
  '11.jpg': '/assets/Gallery/11.jpg'
};

// Fallback images for different categories - using a simple data URL as ultimate fallback
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';

export const fallbackImages = {
  room: '/assets/Homepage/Home 1.jpg',
  restaurant: '/assets/Homepage/Home 2.jpg',
  facility: '/assets/Homepage/View.jpg',
  general: '/assets/Homepage/Home 1.jpg',
  logo: '/assets/Homepage/Home 1.jpg',
  placeholder: placeholderImage
};

/**
 * Get the correct asset path for a given asset name
 * @param {string} assetName - The original asset name
 * @param {string} category - Category for fallback selection (room, restaurant, facility, general)
 * @returns {string} - The correct asset path
 */
export const getAssetPath = (assetName, category = 'general') => {
  // If it's already a full path, return as is
  if (assetName.startsWith('/assets/') && assetName.includes('/')) {
    return assetName;
  }
  
  // Check if we have a mapping for this asset
  if (assetPathMap[assetName]) {
    return assetPathMap[assetName];
  }
  
  // If no mapping found, try to construct path based on category
  const categoryPaths = {
    room: '/assets/Rooms/',
    restaurant: '/assets/Resturent/',
    facility: '/assets/Facilities/',
    homepage: '/assets/Homepage/',
    gallery: '/assets/Gallery/',
    logo: '/assets/Logo/'
  };
  
  if (categoryPaths[category]) {
    return categoryPaths[category] + assetName;
  }
  
  // Return fallback image if nothing else works
  return fallbackImages[category] || fallbackImages.general;
};

/**
 * Handle image loading errors with appropriate fallbacks
 * @param {Event} event - The error event
 * @param {string} category - Category for fallback selection
 */
export const handleImageError = (event, category = 'general') => {
  // Prevent infinite loop by checking if we've already tried fallback
  if (event.target.dataset.fallbackAttempted === 'true') {
    // Use placeholder image as final fallback
    event.target.src = fallbackImages.placeholder;
    event.target.onerror = null;
    console.warn(`Fallback image also failed, using placeholder`);
    return;
  }
  
  // Mark that we've attempted fallback
  event.target.dataset.fallbackAttempted = 'true';
  
  const fallbackPath = fallbackImages[category] || fallbackImages.general;
  event.target.src = fallbackPath;
  console.warn(`Image failed to load: ${event.target.getAttribute('data-original-src') || 'unknown'}, using fallback: ${fallbackPath}`);
};

/**
 * Create an image error handler for a specific category
 * @param {string} category - Category for fallback selection
 * @returns {Function} - Error handler function
 */
export const createImageErrorHandler = (category = 'general') => {
  return (event) => {
    // Store original src for debugging
    if (!event.target.dataset.originalSrc) {
      event.target.dataset.originalSrc = event.target.src;
    }
    handleImageError(event, category);
  };
};