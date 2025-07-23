# Yasin Heaven Star Hotel - Frontend

A standalone React application for the hotel booking system frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API configuration
```

3. **Start the development server:**
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📋 Available Scripts

- `npm start` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## 🔧 Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=Yasin Heaven Star Hotel
REACT_APP_VERSION=1.0.0

# Development settings
GENERATE_SOURCEMAP=false
```

### Environment Variables Explained

- `REACT_APP_API_URL`: The base URL for your backend API
- `REACT_APP_NAME`: Application name displayed in the UI
- `REACT_APP_VERSION`: Application version
- `GENERATE_SOURCEMAP`: Set to false to disable source maps in production

## 🏗️ Project Structure

```
Frontend/
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── config/           # Configuration files
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── styles/           # CSS files
├── build/                # Production build (generated)
└── package.json
```

## 🔌 API Integration

The frontend communicates with the backend API through:

### Centralized Configuration
- `src/config/api.js` - API configuration and helper functions
- `src/services/api.js` - API service layer with axios

### API Helper Functions
```javascript
import { apiRequest } from './config/api';

// Make API requests
const response = await apiRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## 🎨 UI Components

The application uses:
- **Material-UI**: For modern UI components
- **React Icons**: For consistent iconography
- **Styled Components**: For component styling
- **React Router**: For navigation
- **React DatePicker**: For date selection

## 🔐 Authentication

The frontend handles:
- User authentication with JWT tokens
- Admin authentication with separate tokens
- Protected routes and components
- Automatic token refresh and logout

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🚀 Production Build

### Build for Production
```bash
npm run build
```

This creates a `build/` folder with optimized production files.

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel, etc.)
```bash
# Build the app
npm run build

# Deploy the build/ folder to your hosting service
```

#### 2. Serve with Backend
```bash
# Build the app
npm run build

# Copy build/ folder to your backend server
# Configure backend to serve static files
```

#### 3. Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
```

## 🔧 Configuration for Different Backends

### Local Backend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Remote Backend
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Different Port
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🛠️ Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.js`
3. Update navigation if needed

### Adding New API Calls
1. Add function to `src/services/api.js`
2. Use the centralized `apiRequest` helper
3. Handle errors appropriately

### Styling
- Use Material-UI components when possible
- Add custom styles in component files
- Use CSS modules for component-specific styles

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check `REACT_APP_API_URL` in `.env`
   - Ensure backend server is running
   - Check CORS configuration on backend

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Routing Issues**
   - Check React Router configuration
   - Ensure all routes are properly defined
   - Check for conflicting routes

### Performance Optimization

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Use production build for deployment

## 📞 Support

This React application runs independently and can connect to any compatible backend API. Configure the `REACT_APP_API_URL` environment variable to point to your backend server.