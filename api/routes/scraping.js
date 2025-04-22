import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import db from '../../lib/db.js';

const router = express.Router();
puppeteer.use(StealthPlugin());

// Start a new scraping job
router.post('/jobs', async (req, res) => {
  try {
    const { userId, query, location, maxResults, useProxy, proxyUrl } = req.body;
    
    const job = await db.createScrapingJob({
      user_id: userId,
      query,
      location,
      max_results: maxResults,
      use_proxy: useProxy,
      proxy_url: proxyUrl
    });

    // Start scraping process asynchronously
    startScrapingJob(job);

    res.json(job);
  } catch (error) {
    console.error('Error creating scraping job:', error);
    res.status(500).json({ error: 'Failed to create scraping job' });
  }
});

// Get all scraping jobs for a user
router.get('/jobs/:userId', async (req, res) => {
  try {
    const jobs = await db.getScrapingJobs(req.params.userId);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching scraping jobs:', error);
    res.status(500).json({ error: 'Failed to fetch scraping jobs' });
  }
});

// Get a specific job status
router.get('/jobs/:jobId/status', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM scraping_jobs WHERE id = $1',
      [req.params.jobId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ error: 'Failed to fetch job status' });
  }
});

async function startScrapingJob(job) {
  try {
    // Update job status to running
    await db.query(
      'UPDATE scraping_jobs SET status = $1, started_at = NOW() WHERE id = $2',
      ['running', job.id]
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ...(job.use_proxy ? [`--proxy-server=${job.proxy_url}`] : [])
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // TODO: Implement the actual scraping logic here
    // This will be implemented in the next iteration

    await browser.close();

    // Update job status to completed
    await db.query(
      'UPDATE scraping_jobs SET status = $1, completed_at = NOW() WHERE id = $2',
      ['completed', job.id]
    );
  } catch (error) {
    console.error('Error in scraping job:', error);
    
    // Update job status to failed
    await db.query(
      'UPDATE scraping_jobs SET status = $1, error_message = $2 WHERE id = $3',
      ['failed', error.message, job.id]
    );
  }
}

export default router;