/*
  # Add Results Column to Scraping Jobs

  1. Changes
    - Add results column to scraping_jobs table
    - This column will store the number of results found during scraping
    - Default value of 0 to ensure consistency

  2. Notes
    - Uses IF NOT EXISTS for safety
    - Adds results column with default value
    - Maintains backward compatibility
*/

-- Add results column to scraping_jobs if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'results'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN results integer DEFAULT 0;
  END IF;
END $$;