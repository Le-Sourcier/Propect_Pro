/*
  # Add Job Tracking Fields
  
  1. Changes
    - Add started_at timestamp to track when jobs begin
    - Add retry_count for tracking failed attempts
    - Add last_error for detailed error messages
    - Add metadata JSONB field for additional tracking info

  2. Notes
    - Uses safe DO blocks to prevent errors
    - Maintains backward compatibility
*/

DO $$ 
BEGIN
  -- Add started_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'started_at'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN started_at timestamptz;
  END IF;

  -- Add retry_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'retry_count'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN retry_count integer DEFAULT 0;
  END IF;

  -- Add last_error column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'last_error'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN last_error text;
  END IF;

  -- Add metadata column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;