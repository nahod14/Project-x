import React, { useState } from 'react';
import './AddItemForm.css';

interface AddItemFormProps {
  onSubmit: (data: { url: string; targetPrice: number; title?: string }) => Promise<void>;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    url: '',
    targetPrice: '',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.url.trim()) {
      setError('Please enter a product URL');
      return;
    }

    if (!formData.targetPrice.trim()) {
      setError('Please enter a target price');
      return;
    }

    const targetPrice = parseFloat(formData.targetPrice);
    if (isNaN(targetPrice) || targetPrice <= 0) {
      setError('Please enter a valid target price');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        url: formData.url.trim(),
        targetPrice,
        title: formData.title.trim() || undefined,
      });
      
      // Reset form on success
      setFormData({ url: '', targetPrice: '', title: '' });
    } catch (error: any) {
      setError(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const getSupportedSites = () => [
    'Amazon.com',
    'eBay.com', 
    'Best Buy',
    'Target.com',
    'Walmart.com',
    'And many more...'
  ];

  return (
    <div className="add-item-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Product URL *</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://www.amazon.com/product-name/dp/..."
            required
            disabled={loading}
          />
          <small className="form-help">
            Paste the URL of the product you want to track
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="targetPrice">Target Price ($) *</label>
          <input
            type="number"
            id="targetPrice"
            name="targetPrice"
            value={formData.targetPrice}
            onChange={handleChange}
            placeholder="99.99"
            min="0"
            step="0.01"
            required
            disabled={loading}
          />
          <small className="form-help">
            You'll be notified when the price drops to or below this amount
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="title">Custom Title (Optional)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="My Custom Product Name"
            disabled={loading}
          />
          <small className="form-help">
            Leave blank to auto-detect from the product page
          </small>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="supported-sites">
        <h4>Supported Sites:</h4>
        <div className="sites-list">
          {getSupportedSites().map((site, index) => (
            <span key={index} className="site-tag">
              {site}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddItemForm; 