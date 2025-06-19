import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import AddItemForm from './AddItemForm';
import PriceChart from './PriceChart';
import './Dashboard.css';

interface Product {
  _id: string;
  title: string;
  url: string;
  imageUrl: string;
  currentPrice: number;
  targetPrice: number;
  priceHistory: Array<{price: number, date: string}>;
  createdAt: string;
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
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      await productService.addProduct(productData);
      setShowAddForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleRefreshPrice = async (productId: string) => {
    try {
      setRefreshingId(productId);
      await productService.refreshPrice(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error refreshing price:', error);
    } finally {
      setRefreshingId(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to stop tracking this product?')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const calculateOverallStats = () => {
    const totalProducts = products.length;
    const atTargetPrice = products.filter(p => p.stats?.isAtTarget).length;
    const totalSavings = products.reduce((sum, p) => sum + (p.stats?.savingsFromHighest || 0), 0);
    const avgSavingsPercent = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.stats?.savingsPercent || 0), 0) / products.length 
      : 0;

    return { totalProducts, atTargetPrice, totalSavings, avgSavingsPercent };
  };

  const overallStats = calculateOverallStats();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your tracked products...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Price Tracker Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {/* Overall Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{overallStats.totalProducts}</div>
        </div>
        <div className="stat-card">
          <h3>At Target Price</h3>
          <div className="stat-value success">{overallStats.atTargetPrice}</div>
        </div>
        <div className="stat-card">
          <h3>Total Savings</h3>
          <div className="stat-value">${overallStats.totalSavings.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3>Avg Savings %</h3>
          <div className="stat-value">{overallStats.avgSavingsPercent.toFixed(1)}%</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Product
        </button>
        <button 
          className="btn btn-secondary"
          onClick={fetchProducts}
        >
          🔄 Refresh All
        </button>
      </div>

      {/* Add Product Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Product to Track</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <AddItemForm 
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products tracked yet</h2>
          <p>Start tracking your first product to see price changes over time!</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className="placeholder-image">📦</div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                
                <div className="price-info">
                  <div className="current-price">
                    <span className="label">Current:</span>
                    <span className="price">${product.currentPrice}</span>
                  </div>
                  <div className="target-price">
                    <span className="label">Target:</span>
                    <span className="price">${product.targetPrice}</span>
                  </div>
                </div>

                {product.stats && (
                  <div className="product-stats">
                    <div className={`price-change ${product.stats.priceChange >= 0 ? 'positive' : 'negative'}`}>
                      {product.stats.priceChange >= 0 ? '↗' : '↘'} 
                      {product.stats.priceChangePercent}%
                    </div>
                    
                    {product.stats.isAtTarget && (
                      <div className="at-target">🎯 At Target!</div>
                    )}
                    
                    <div className="savings">
                      Saved: ${product.stats.savingsFromHighest.toFixed(2)} 
                      ({product.stats.savingsPercent.toFixed(1)}%)
                    </div>
                    
                    <div className="tracking-info">
                      Tracked for {product.stats.daysTracked} days
                    </div>
                  </div>
                )}

                <div className="product-actions">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleRefreshPrice(product._id)}
                    disabled={refreshingId === product._id}
                  >
                    {refreshingId === product._id ? '⏳' : '🔄'} Refresh
                  </button>
                  
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedProduct(product)}
                  >
                    📊 View Chart
                  </button>
                  
                  <a 
                    href={product.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    🔗 Visit
                  </a>
                  
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price Chart Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h2>Price History - {selectedProduct.title}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
            </div>
            <PriceChart 
              productId={selectedProduct._id}
              currentPrice={selectedProduct.currentPrice}
              targetPrice={selectedProduct.targetPrice}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 