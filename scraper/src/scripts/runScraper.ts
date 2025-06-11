import { startScraping } from '../index';

const SCRAPE_INTERVAL = 1000 * 60 * 60; // Run every hour

async function runScraper() {
  try {
    console.log('Starting scraper service...');
    await startScraping();
    console.log('Scraping completed successfully');
  } catch (error) {
    console.error('Error running scraper:', error);
  }
}

// Run immediately on startup
runScraper();

// Then run periodically
setInterval(runScraper, SCRAPE_INTERVAL);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Scraper service shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Scraper service shutting down...');
  process.exit(0);
}); 