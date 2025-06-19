import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import type { PriceHistoryResponse } from '../services/productService';

interface PriceChartProps {
  productId: string;
  currentPrice: number;
  targetPrice: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ productId, currentPrice, targetPrice }) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchPriceHistory();
  }, [productId, selectedPeriod]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      const data = await productService.getPriceHistory(productId, selectedPeriod);
      setPriceHistory(data);
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!priceHistory || priceHistory.priceHistory.length === 0) {
      return { min: 0, max: 0, avg: 0, change: 0, changePercent: 0 };
    }

    const prices = priceHistory.priceHistory.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = lastPrice - firstPrice;
    const changePercent = firstPrice > 0 ? (change / firstPrice) * 100 : 0;

    return { min, max, avg, change, changePercent };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="price-chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading price history...</p>
      </div>
    );
  }

  if (!priceHistory || priceHistory.priceHistory.length === 0) {
    return (
      <div className="price-chart-empty">
        <p>No price history available for this product.</p>
      </div>
    );
  }

  return (
    <div className="price-chart">
      <div className="chart-controls">
        <div className="period-selector">
          <label>Time Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 3 months</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      <div className="chart-stats">
        <div className="stat-item">
          <span className="label">Current Price:</span>
          <span className="value">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="label">Target Price:</span>
          <span className="value">${targetPrice.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="label">Lowest:</span>
          <span className="value">${stats.min.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="label">Highest:</span>
          <span className="value">${stats.max.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="label">Average:</span>
          <span className="value">${stats.avg.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="label">Change:</span>
          <span className={`value ${stats.change >= 0 ? 'positive' : 'negative'}`}>
            {stats.change >= 0 ? '+' : ''}${stats.change.toFixed(2)} 
            ({stats.changePercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="simple-chart">
        <div className="chart-container">
          <svg viewBox="0 0 800 400" className="price-svg">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Price line */}
            <PriceLineChart 
              data={priceHistory.priceHistory}
              width={800}
              height={400}
              currentPrice={currentPrice}
              targetPrice={targetPrice}
            />
          </svg>
        </div>
      </div>

      <div className="price-table">
        <h4>Recent Price Changes</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {priceHistory.priceHistory.slice(-10).reverse().map((entry, index, arr) => {
                const prevPrice = index < arr.length - 1 ? arr[index + 1].price : entry.price;
                const change = entry.price - prevPrice;
                const changePercent = prevPrice > 0 ? (change / prevPrice) * 100 : 0;
                
                return (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>${entry.price.toFixed(2)}</td>
                    <td className={change >= 0 ? 'positive' : 'negative'}>
                      {change !== 0 && (
                        <>
                          {change >= 0 ? '+' : ''}${change.toFixed(2)} 
                          ({changePercent.toFixed(1)}%)
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple SVG line chart component
interface PriceLineChartProps {
  data: Array<{price: number, date: string}>;
  width: number;
  height: number;
  currentPrice: number;
  targetPrice: number;
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({ 
  data, width, height, currentPrice, targetPrice 
}) => {
  if (data.length === 0) return null;

  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices, targetPrice) * 0.95;
  const maxPrice = Math.max(...prices, targetPrice) * 1.05;
  const priceRange = maxPrice - minPrice;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight;
    return { x, y, price: point.price, date: point.date };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Target price line
  const targetY = padding + ((maxPrice - targetPrice) / priceRange) * chartHeight;

  return (
    <g>
      {/* Target price line */}
      <line
        x1={padding}
        y1={targetY}
        x2={width - padding}
        y2={targetY}
        stroke="#e74c3c"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <text x={width - padding + 5} y={targetY + 5} fill="#e74c3c" fontSize="12">
        Target: ${targetPrice.toFixed(2)}
      </text>

      {/* Price line */}
      <path
        d={pathData}
        fill="none"
        stroke="#3498db"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#3498db"
          stroke="white"
          strokeWidth="2"
        >
          <title>${point.price.toFixed(2)} on {new Date(point.date).toLocaleDateString()}</title>
        </circle>
      ))}

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const price = minPrice + (maxPrice - minPrice) * (1 - ratio);
        const y = padding + ratio * chartHeight;
        return (
          <g key={ratio}>
            <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#666" />
            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">
              ${price.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {points.filter((_, index) => index % Math.ceil(points.length / 5) === 0).map((point, index) => (
        <g key={index}>
          <line x1={point.x} y1={height - padding} x2={point.x} y2={height - padding + 5} stroke="#666" />
          <text x={point.x} y={height - padding + 20} textAnchor="middle" fontSize="12" fill="#666">
            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </text>
        </g>
      ))}
    </g>
  );
};

export default PriceChart; 