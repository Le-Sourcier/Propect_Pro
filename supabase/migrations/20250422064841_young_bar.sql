/*
  # Add Date Column to Scraping Jobs

  1. Changes
    - Add date column to scraping_jobs table
    - Add index on date column for better performance

  2. Notes
    - Uses IF NOT EXISTS for safety
    - Adds date column with default value
*/

-- Add date column to scraping_jobs if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'date'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN date timestamptz DEFAULT now();
  END IF;
END $$;

-- Create index for date column if it doesn't exist
CREATE INDEX IF NOT EXISTS scraping_jobs_date_idx ON scraping_jobs(date);