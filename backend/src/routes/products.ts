import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  refreshProductPrice,
  getPriceHistory
} from '../controllers/productController';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

// Validation middleware
const productValidation = [
  body('url').isURL().withMessage('Please provide a valid URL'),
  body('targetPrice').isNumeric().withMessage('Target price must be a number'),
  body('title').optional().isString().withMessage('Title must be a string'),
];

const updateValidation = [
  body('targetPrice').optional().isNumeric().withMessage('Target price must be a number'),
  body('title').optional().isString().withMessage('Title must be a string'),
];

// Routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', productValidation, addProduct);
router.patch('/:id', updateValidation, updateProduct);
router.delete('/:id', deleteProduct);

// New price tracking routes
router.post('/:id/refresh', refreshProductPrice);
router.get('/:id/history', getPriceHistory);

export default router; 