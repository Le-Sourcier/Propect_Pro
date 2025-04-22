import express from 'express';
import db from '../../lib/db.js';

const router = express.Router();

// Start a new enrichment job
router.post('/jobs', async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      sourceFileUrl,
      useInsee,
      useSocieteCom,
      useLinkedin
    } = req.body;
    
    const job = await db.createEnrichmentJob({
      user_id: userId,
      name,
      description,
      source_file_url: sourceFileUrl,
      use_insee: useInsee,
      use_societe_com: useSocieteCom,
      use_linkedin: useLinkedin
    });

    // Start enrichment process asynchronously
    startEnrichmentJob(job);

    res.json(job);
  } catch (error) {
    console.error('Error creating enrichment job:', error);
    res.status(500).json({ error: 'Failed to create enrichment job' });
  }
});

// Get all enrichment jobs for a user
router.get('/jobs/:userId', async (req, res) => {
  try {
    const jobs = await db.getEnrichmentJobs(req.params.userId);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching enrichment jobs:', error);
    res.status(500).json({ error: 'Failed to fetch enrichment jobs' });
  }
});

// Get a specific job status
router.get('/jobs/:jobId/status', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM enrichment_jobs WHERE id = $1',
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

async function startEnrichmentJob(job) {
  try {
    // Update job status to running
    await db.query(
      'UPDATE enrichment_jobs SET status = $1, started_at = NOW() WHERE id = $2',
      ['running', job.id]
    );

    // TODO: Implement the actual enrichment logic here
    // This will be implemented in the next iteration

    // Update job status to completed
    await db.query(
      'UPDATE enrichment_jobs SET status = $1, completed_at = NOW() WHERE id = $2',
      ['completed', job.id]
    );
  } catch (error) {
    console.error('Error in enrichment job:', error);
    
    // Update job status to failed
    await db.query(
      'UPDATE enrichment_jobs SET status = $1, error_message = $2 WHERE id = $3',
      ['failed', error.message, job.id]
    );
  }
}

export default router;