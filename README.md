# 🛒 Project X - Advanced Price Tracker

A comprehensive price tracking application that monitors product prices across multiple e-commerce platforms and provides intelligent analytics, alerts, and insights.

## 🚀 Features

### Core Price Tracking
- **Multi-Platform Support**: Track prices from Amazon, eBay, Best Buy, Target, Walmart, and more
- **Real-Time Price Monitoring**: Automatic price updates with historical tracking
- **Smart Price Analytics**: Advanced statistics including volatility, trends, and predictions
- **Target Price Alerts**: Get notified when products reach your desired price point

### Advanced Analytics
- **Price History Visualization**: Interactive charts showing price trends over time
- **Savings Calculator**: Track how much you've saved from peak prices
- **Best Time to Buy**: AI-powered recommendations for optimal purchase timing
- **Price Volatility Analysis**: Understand price stability and fluctuation patterns

### User Experience
- **Modern Dashboard**: Clean, responsive interface with real-time updates
- **Product Management**: Easy add/edit/delete with bulk operations
- **Search & Filter**: Find products quickly with advanced filtering
- **Mobile Responsive**: Full functionality on all devices

## 🏗️ Architecture

```
Project-x/
├── backend/          # Node.js + Express API
├── frontend/         # React + TypeScript UI
├── scraper/          # Price scraping service
└── docker-compose.yml # Container orchestration
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **TypeScript** - Type-safe development
- **MongoDB** - Document database
- **Playwright** - Web scraping engine
- **JWT** - Authentication
- **Express Validator** - Input validation

### Frontend
- **React 18** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool
- **Custom CSS** - Responsive design
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **MongoDB** - Database
- **Node.js 18+** - Runtime environment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Docker (optional)

### 1. Clone & Install
```bash
git clone <repository-url>
cd Project-x

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../frontend && npm install

# Install scraper dependencies
cd ../scraper && npm install
```

### 2. Environment Setup
Create `.env` files in each directory:

**backend/.env**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pricetracker
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:3001/api
```

**scraper/.env**
```env
MONGODB_URI=mongodb://localhost:27017/pricetracker
SCRAPE_INTERVAL=3600000
```

### 3. Start Services

#### Option A: Local Development
```bash
# Start MongoDB
mongod

# Start backend (in backend/)
npm run dev

# Start frontend (in frontend/)  
npm run dev

# Start scraper (in scraper/)
npm start
```

#### Option B: Docker
```bash
docker compose up --build -d
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📊 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Product Management
```http
GET    /api/products              # Get all tracked products
GET    /api/products/:id          # Get single product
POST   /api/products              # Add new product
PATCH  /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product
```

### Price Tracking
```http
POST /api/products/:id/refresh    # Manually refresh price
GET  /api/products/:id/history    # Get price history
```

### Example API Usage

#### Add New Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://www.amazon.com/product-url",
    "targetPrice": 99.99,
    "title": "My Product"
  }'
```

#### Get Price History
```bash
curl http://localhost:3001/api/products/PRODUCT_ID/history?days=30 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Key Features Implemented

### 1. Enhanced Product Controller
- **Advanced Statistics**: Price volatility, savings calculations, trend analysis
- **Smart Analytics**: Best time to buy recommendations
- **Bulk Operations**: Refresh multiple products simultaneously

### 2. Modern Dashboard
- **Real-time Updates**: Live price monitoring
- **Interactive Charts**: SVG-based price history visualization  
- **Responsive Design**: Mobile-first approach
- **Smart Filtering**: Search and filter products

### 3. Intelligent Scraping
- **Multi-site Support**: Extensible scraper architecture
- **Error Handling**: Robust retry mechanisms
- **Rate Limiting**: Respectful scraping practices

### 4. User Experience
- **Authentication**: Secure JWT-based auth
- **Form Validation**: Client and server-side validation
- **Loading States**: Smooth user interactions
- **Error Handling**: Comprehensive error management

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run test         # Run tests
```

### Frontend Development  
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database Management
```bash
# Connect to MongoDB
mongo pricetracker

# View collections
show collections

# Query products
db.products.find().pretty()
```

## 📈 Performance Features

- **Efficient Scraping**: Playwright-based scraping with caching
- **Database Optimization**: Indexed queries and aggregation pipelines
- **Frontend Optimization**: Code splitting and lazy loading
- **Responsive Design**: Optimized for all screen sizes

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Production Build
```bash
# Build all services
npm run build:all

# Start production
npm run start:prod
```

### Docker Production
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@projectx.com or join our Discord community.

---

**Built with ❤️ by the Project X Team** 