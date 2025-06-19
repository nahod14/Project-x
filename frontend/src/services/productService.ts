import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Product {
  _id: string;
  title: string;
  url: string;
  imageUrl: string;
  currentPrice: number;
  targetPrice: number;
  priceHistory: Array<{price: number, date: string}>;
  createdAt: string;
  updatedAt: string;
  stats?: {
    lowestPrice: number;
    highestPrice: number;
    priceChange: number;
    priceChangePercent: number;
    isAtTarget: boolean;
    savingsFromHighest: number;
    savingsPercent: number;
    daysTracked: number;
  };
  analytics?: {
    totalDataPoints: number;
    averagePrice: number;
    priceVolatility: number;
    bestTimeToBuy: string;
    priceDropAlerts: number;
    lastUpdated: string;
  };
}

export interface CreateProductData {
  url: string;
  targetPrice: number;
  title?: string;
}

export interface UpdateProductData {
  targetPrice?: number;
  title?: string;
}

export interface PriceHistoryResponse {
  productId: string;
  title: string;
  currentPrice: number;
  targetPrice: number;
  priceHistory: Array<{price: number, date: string}>;
  period: string;
}

export const productService = {
  // Get all products for the authenticated user
  async getProducts() {
    const response = await api.get('/products');
    return response.data;
  },

  // Get a single product with detailed analytics
  async getProduct(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Add a new product to track
  async addProduct(data: CreateProductData) {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update product details
  async updateProduct(id: string, data: UpdateProductData) {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  // Delete a product
  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Manually refresh product price
  async refreshPrice(id: string) {
    const response = await api.post(`/products/${id}/refresh`);
    return response.data;
  },

  // Get price history for a product
  async getPriceHistory(id: string, days: number = 30): Promise<PriceHistoryResponse> {
    const response = await api.get(`/products/${id}/history?days=${days}`);
    return response.data;
  },

  // Bulk refresh all products (if we add this endpoint later)
  async refreshAllPrices() {
    const products = await this.getProducts();
    const refreshPromises = products.data.data.map((product: Product) => 
      this.refreshPrice(product._id).catch(err => ({ error: err, productId: product._id }))
    );
    
    return Promise.allSettled(refreshPromises);
  },

  // Get products that are at target price
  async getProductsAtTarget() {
    const response = await this.getProducts();
    return response.data.data.filter((product: Product) => 
      product.stats?.isAtTarget
    );
  },

  // Get products with biggest savings
  async getTopSavings(limit: number = 5) {
    const response = await this.getProducts();
    return response.data.data
      .filter((product: Product) => product.stats?.savingsFromHighest > 0)
      .sort((a: Product, b: Product) => 
        (b.stats?.savingsFromHighest || 0) - (a.stats?.savingsFromHighest || 0)
      )
      .slice(0, limit);
  },

  // Search products by title or URL
  async searchProducts(query: string) {
    const response = await this.getProducts();
    const searchTerm = query.toLowerCase();
    
    return response.data.data.filter((product: Product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.url.toLowerCase().includes(searchTerm)
    );
  },

  // Get price statistics across all products
  async getOverallStats() {
    const response = await this.getProducts();
    const products = response.data.data;
    
    const stats = {
      totalProducts: products.length,
      totalValue: products.reduce((sum: number, p: Product) => sum + p.currentPrice, 0),
      totalSavings: products.reduce((sum: number, p: Product) => sum + (p.stats?.savingsFromHighest || 0), 0),
      atTargetCount: products.filter((p: Product) => p.stats?.isAtTarget).length,
      avgSavingsPercent: products.length > 0 
        ? products.reduce((sum: number, p: Product) => sum + (p.stats?.savingsPercent || 0), 0) / products.length 
        : 0,
      mostTrackedDays: Math.max(...products.map((p: Product) => p.stats?.daysTracked || 0), 0),
      biggestSaver: products.reduce((max: Product | null, current: Product) => {
        if (!max) return current;
        const currentSavings = current.stats?.savingsFromHighest || 0;
        const maxSavings = max.stats?.savingsFromHighest || 0;
        return currentSavings > maxSavings ? current : max;
      }, null)
    };
    
    return stats;
  }
};

export default productService; 