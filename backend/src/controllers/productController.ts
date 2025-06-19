import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { IUser } from '../models/User';
import { chromium } from 'playwright';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const addProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { url, title, imageUrl, currentPrice, targetPrice } = req.body;

    // Check if product already exists for this user
    const existingProduct = await Product.findOne({
      user: req.user!._id,
      url,
    });

    if (existingProduct) {
      next(new AppError('Product already being tracked', 400));
      return;
    }

    // Create new product
    const product = await Product.create({
      url,
      title,
      imageUrl,
      currentPrice,
      targetPrice,
      user: req.user!._id,
      priceHistory: [{ price: currentPrice, date: new Date() }],
    });

    res.status(201).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find({ user: req.user!._id }).sort({
      createdAt: -1,
    });

    // Add price statistics to each product
    const productsWithStats = products.map(product => {
      const priceHistory = product.priceHistory;
      const currentPrice = product.currentPrice;
      const targetPrice = product.targetPrice;
      
      let lowestPrice = currentPrice;
      let highestPrice = currentPrice;
      let priceChange = 0;
      let priceChangePercent = 0;
      
      if (priceHistory.length > 0) {
        lowestPrice = Math.min(...priceHistory.map(p => p.price), currentPrice);
        highestPrice = Math.max(...priceHistory.map(p => p.price), currentPrice);
        
        if (priceHistory.length > 1) {
          const previousPrice = priceHistory[priceHistory.length - 2].price;
          priceChange = currentPrice - previousPrice;
          priceChangePercent = ((priceChange / previousPrice) * 100);
        }
      }
      
      const isAtTarget = currentPrice <= targetPrice;
      const savingsFromHighest = highestPrice - currentPrice;
      const savingsPercent = highestPrice > 0 ? ((savingsFromHighest / highestPrice) * 100) : 0;
      
      return {
        ...product.toObject(),
        stats: {
          lowestPrice,
          highestPrice,
          priceChange,
          priceChangePercent: Math.round(priceChangePercent * 100) / 100,
          isAtTarget,
          savingsFromHighest,
          savingsPercent: Math.round(savingsPercent * 100) / 100,
          daysTracked: Math.ceil((Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        }
      };
    });
    
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: productsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!product) {
      next(new AppError('Product not found', 404));
      return;
    }

    // Calculate detailed analytics
    const priceHistory = product.priceHistory;
    const analytics = {
      totalDataPoints: priceHistory.length,
      averagePrice: priceHistory.length > 0 ? 
        priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length : product.currentPrice,
      priceVolatility: calculatePriceVolatility(priceHistory),
      bestTimeToBuy: findBestTimeToBuy(priceHistory),
      priceDropAlerts: priceHistory.filter(p => p.price <= product.targetPrice).length,
      lastUpdated: priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].date : product.updatedAt
    };

    res.status(200).json({
      status: 'success',
      data: {
        ...product.toObject(),
        analytics
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { targetPrice, title } = req.body;
    const updateData: any = {};
    
    if (targetPrice !== undefined) updateData.targetPrice = targetPrice;
    if (title !== undefined) updateData.title = title;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      updateData,
      { new: true }
    );

    if (!product) {
      next(new AppError('Product not found', 404));
      return;
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!product) {
      next(new AppError('Product not found', 404));
      return;
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Manually refresh product price
export const refreshProductPrice = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    try {
      const scrapedData = await scrapeProductData(product.url);
      
      if (scrapedData?.price && scrapedData.price !== product.currentPrice) {
        product.currentPrice = scrapedData.price;
        product.priceHistory.push({
          price: scrapedData.price,
          date: new Date()
        });
        
        if (scrapedData.title && !product.title) {
          product.title = scrapedData.title;
        }
        
        if (scrapedData.imageUrl && !product.imageUrl) {
          product.imageUrl = scrapedData.imageUrl;
        }
        
        await product.save();
      }
      
      res.json({
        ...product.toObject(),
        message: 'Price updated successfully',
        newPrice: scrapedData?.price,
        priceChanged: scrapedData?.price !== product.currentPrice
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to refresh price', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get price history for a product
export const getPriceHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    const filteredHistory = product.priceHistory.filter(
      entry => entry.date >= daysAgo
    );

    res.json({
      productId: product._id,
      title: product.title,
      currentPrice: product.currentPrice,
      targetPrice: product.targetPrice,
      priceHistory: filteredHistory,
      period: `${days} days`
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { url, targetPrice, title } = req.body;

    // Check if product already exists for this user
    const existingProduct = await Product.findOne({
      user: req.user!._id,
      url,
    });

    if (existingProduct) {
      next(new AppError('Product already being tracked', 400));
      return;
    }

    // Try to scrape initial product data
    let scrapedData = null;
    try {
      scrapedData = await scrapeProductData(url);
    } catch (error) {
      console.log('Initial scraping failed, will retry later:', error);
    }

    const product = new Product({
      url,
      targetPrice,
      title: title || scrapedData?.title || 'Product',
      imageUrl: scrapedData?.imageUrl || '',
      currentPrice: scrapedData?.price || 0,
      priceHistory: scrapedData?.price ? [{
        price: scrapedData.price,
        date: new Date()
      }] : [],
      user: req.user!._id,
    });

    await product.save();
    
    res.status(201).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
async function scrapeProductData(url: string): Promise<{title?: string, price?: number, imageUrl?: string} | null> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    let title, price, imageUrl;
    
    // Amazon
    if (url.includes('amazon.com')) {
      title = await page.textContent('#productTitle') || undefined;
      const priceText = await page.textContent('.a-price-whole') || 
                       await page.textContent('#priceblock_ourprice') || 
                       await page.textContent('#priceblock_dealprice') || '';
      price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      imageUrl = await page.getAttribute('#landingImage', 'src') || undefined;
    }
    // Add more sites as needed
    
    return { title, price: isNaN(price!) ? undefined : price, imageUrl };
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  } finally {
    await browser.close();
  }
}

function calculatePriceVolatility(priceHistory: Array<{price: number, date: Date}>): number {
  if (priceHistory.length < 2) return 0;
  
  const prices = priceHistory.map(p => p.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  
  return Math.sqrt(variance);
}

function findBestTimeToBuy(priceHistory: Array<{price: number, date: Date}>): string {
  if (priceHistory.length === 0) return 'No data available';
  
  const lowestPriceEntry = priceHistory.reduce((min, current) => 
    current.price < min.price ? current : min
  );
  
  return `Best price was $${lowestPriceEntry.price} on ${lowestPriceEntry.date.toLocaleDateString()}`;
} 