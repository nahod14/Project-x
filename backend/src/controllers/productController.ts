import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url, title, imageUrl, currentPrice, targetPrice } = req.body;

    // Check if product already exists for this user
    const existingProduct = await Product.findOne({
      userId: req.user._id,
      url,
    });

    if (existingProduct) {
      return next(new AppError('Product already being tracked', 400));
    }

    // Create new product
    const product = await Product.create({
      url,
      title,
      imageUrl,
      currentPrice,
      targetPrice,
      userId: req.user._id,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPrice, targetPrice } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // If price has changed, add to price history
    if (currentPrice && currentPrice !== product.currentPrice) {
      product.priceHistory.push({
        price: currentPrice,
        date: new Date(),
      });
    }

    // Update product
    Object.assign(product, {
      ...req.body,
      currentPrice: currentPrice || product.currentPrice,
      targetPrice: targetPrice || product.targetPrice,
    });

    await product.save();

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 