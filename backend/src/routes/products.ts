import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import Product from '../models/Product';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Protect all routes
router.use(protect);

// Validation middleware
const productValidation = [
  body('url').isURL().withMessage('Please provide a valid URL'),
  body('targetPrice').isNumeric().withMessage('Target price must be a number'),
];

// Get all products for the authenticated user
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get a single product
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create a new product
router.post('/', productValidation, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { url, targetPrice } = req.body;

    const product = new Product({
      url,
      targetPrice,
      user: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Update a product
router.patch('/:id', productValidation, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { targetPrice } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { targetPrice },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Delete a product
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router; 