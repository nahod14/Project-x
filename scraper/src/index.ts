import { chromium } from 'playwright';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/price-tracker')
  .then(() => {
    console.log('Connected to MongoDB');
    startScraping();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export async function startScraping() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  try {
    // Get all products that need price updates
    const products = await Product.find({}).populate('userId');

    for (const product of products) {
      try {
        const page = await context.newPage();
        await page.goto(product.url);

        // Extract price based on the website
        const price = await extractPrice(page, product.url);
        if (price && price !== product.currentPrice) {
          // Update product price and add to history
          product.currentPrice = price;
          product.priceHistory.push({
            price,
            date: new Date(),
          });
          await product.save();

          // Check if price is below target
          if (price <= product.targetPrice) {
            // TODO: Send email notification
            console.log(
              `Price alert for ${product.title}: Current price ${price} is below target ${product.targetPrice}`
            );
          }
        }

        await page.close();
      } catch (error) {
        console.error(`Error scraping ${product.url}:`, error);
      }
    }
  } catch (error) {
    console.error('Scraping error:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

async function extractPrice(page: any, url: string): Promise<number | null> {
  try {
    // Amazon
    if (url.includes('amazon.com')) {
      const priceElement = await page.$('#priceblock_ourprice, #priceblock_dealprice');
      if (priceElement) {
        const priceText = await priceElement.textContent();
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
      }
    }
    // Walmart
    else if (url.includes('walmart.com')) {
      const priceElement = await page.$('[data-automation-id="product-price"]');
      if (priceElement) {
        const priceText = await priceElement.textContent();
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
      }
    }
    // AliExpress
    else if (url.includes('aliexpress.com')) {
      const priceElement = await page.$('.product-price-value');
      if (priceElement) {
        const priceText = await priceElement.textContent();
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting price:', error);
    return null;
  }
} 