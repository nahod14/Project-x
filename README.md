# Price Tracker Application

A full-stack application for tracking product prices across various e-commerce platforms.

## Features

- User authentication and authorization
- Product price tracking from multiple e-commerce sites
- Price history visualization
- Price drop notifications
- Real-time price updates

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- Scraper Service: Node.js, Puppeteer
- Containerization: Docker

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- MongoDB (if running locally)

## Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd price-tracker
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install service dependencies
   cd frontend && npm install
   cd ../backend && npm install
   cd ../scraper && npm install
   ```

3. Set up environment variables:
   - Create `.env` files in each service directory (frontend, backend, scraper)
   - See `.env.example` files for required variables

4. Start the development servers:
   ```bash
   # Start MongoDB (if running locally)
   brew services start mongodb-community

   # Start the backend
   cd backend && npm run dev

   # Start the frontend
   cd frontend && npm run dev

   # Start the scraper service
   cd scraper && npm run dev
   ```

## Production Deployment

### Using Docker Compose

1. Build and start the services:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: mongodb://localhost:27017

### Manual Deployment

1. Build the services:
   ```bash
   # Frontend
   cd frontend
   npm run build

   # Backend
   cd backend
   npm run build

   # Scraper
   cd scraper
   npm run build
   ```

2. Start the services:
   ```bash
   # Frontend
   cd frontend
   npm start

   # Backend
   cd backend
   npm start

   # Scraper
   cd scraper
   npm start
   ```

## Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/price-tracker
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Scraper (.env)
```
MONGODB_URI=mongodb://localhost:27017/price-tracker
NODE_ENV=production
```

## API Documentation

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- POST /api/products - Add new product
- GET /api/products/:id - Get product details
- PATCH /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 