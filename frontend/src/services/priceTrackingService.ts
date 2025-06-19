import api from './api';
import { ErrorMessages } from '../utils/errorHandler';

export interface PriceHistory {
  date: string;
  price: number;
}

export interface TrackedItem {
  id: string;
  name: string;
  url: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceAlert {
  id: string;
  itemId: string;
  targetPrice: number;
  condition: 'below' | 'above';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemData {
  url: string;
}

export interface AddAlertData {
  itemId: string;
  targetPrice: number;
  condition: 'below' | 'above';
}

const priceTrackingService = {
  async getTrackedItems(): Promise<TrackedItem[]> {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.PRICE_TRACKING.INVALID_URL);
    }
  },

  async addItem(data: AddItemData): Promise<TrackedItem> {
    try {
      const response = await api.post('/items', data);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.PRICE_TRACKING.INVALID_URL);
    }
  },

  async deleteItem(itemId: string): Promise<void> {
    try {
      await api.delete(`/items/${itemId}`);
    } catch (error) {
      throw new Error(ErrorMessages.GENERAL.RETRY);
    }
  },

  async getPriceAlerts(): Promise<PriceAlert[]> {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.GENERAL.RETRY);
    }
  },

  async addPriceAlert(data: AddAlertData): Promise<PriceAlert> {
    try {
      const response = await api.post('/alerts', data);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.PRICE_TRACKING.INVALID_ALERT);
    }
  },

  async deletePriceAlert(alertId: string): Promise<void> {
    try {
      await api.delete(`/alerts/${alertId}`);
    } catch (error) {
      throw new Error(ErrorMessages.GENERAL.RETRY);
    }
  },

  async updatePriceAlert(alertId: string, isActive: boolean): Promise<PriceAlert> {
    try {
      const response = await api.patch(`/alerts/${alertId}`, { isActive });
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.GENERAL.RETRY);
    }
  }
};

export default priceTrackingService; 