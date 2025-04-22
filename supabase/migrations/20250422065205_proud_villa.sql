/*
  # Add source column to scraping_jobs table

  1. Changes
    - Add source column to scraping_jobs table
    - Set default value to 'google-maps'
    - Add check constraint to validate source values

  2. Notes
    - Uses safe DO block to check for column existence
    - Adds validation for source values
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scraping_jobs' AND column_name = 'source'
  ) THEN
    ALTER TABLE scraping_jobs ADD COLUMN source text DEFAULT 'google-maps';
    ALTER TABLE scraping_jobs ADD CONSTRAINT valid_source CHECK (
      source IN ('google-maps', 'linkedin', 'yellow-pages', 'societe-com')
    );
  END IF;
END $$;