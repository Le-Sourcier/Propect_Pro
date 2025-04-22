/*
  # Initial Schema Setup for B2B Prospecting Platform

  1. New Tables
    - `businesses`
      - Core table for storing business information
      - Contains basic and enriched data
      - Tracks data sources and updates
    
    - `scraping_jobs`
      - Tracks Google Maps scraping operations
      - Stores job configuration and status
    
    - `enrichment_jobs`
      - Tracks data enrichment operations
      - Links to businesses for updates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  
  -- Basic information
  name text NOT NULL,
  siret text,
  siren text,
  website text,
  phone text,
  email text,
  
  -- Address
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'France',
  latitude numeric,
  longitude numeric,
  
  -- Business details
  business_type text,
  naf_code text,
  employee_count int,
  annual_revenue numeric,
  
  -- Google Maps data
  google_maps_url text,
  google_rating numeric,
  google_reviews_count int,
  google_place_id text,
  
  -- Metadata
  data_sources text[] DEFAULT '{}',
  last_enriched_at timestamptz,
  enrichment_status text DEFAULT 'pending',
  
  -- Constraints
  CONSTRAINT unique_siret UNIQUE NULLS NOT DISTINCT (siret),
  CONSTRAINT unique_siren UNIQUE NULLS NOT DISTINCT (siren)
);

-- Scraping jobs table
CREATE TABLE IF NOT EXISTS scraping_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  
  -- Job configuration
  query text NOT NULL,
  location text NOT NULL,
  max_results int DEFAULT 100,
  
  -- Proxy settings
  use_proxy boolean DEFAULT false,
  proxy_url text,
  
  -- Job status
  status text DEFAULT 'pending',
  progress numeric DEFAULT 0,
  total_results int DEFAULT 0,
  successful_results int DEFAULT 0,
  error_count int DEFAULT 0,
  error_message text,
  
  -- Job results
  results_file_url text,
  completed_at timestamptz
);

-- Enrichment jobs table
CREATE TABLE IF NOT EXISTS enrichment_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  
  -- Job configuration
  name text NOT NULL,
  description text,
  source_file_url text,
  
  -- Data sources to use
  use_insee boolean DEFAULT true,
  use_societe_com boolean DEFAULT false,
  use_linkedin boolean DEFAULT false,
  
  -- Job status
  status text DEFAULT 'pending',
  progress numeric DEFAULT 0,
  total_records int DEFAULT 0,
  enriched_records int DEFAULT 0,
  error_count int DEFAULT 0,
  error_message text,
  
  -- Job results
  results_file_url text,
  completed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_jobs ENABLE ROW LEVEL SECURITY;

-- Policies for businesses
CREATE POLICY "Users can view their own businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for scraping jobs
CREATE POLICY "Users can view their own scraping jobs"
  ON scraping_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scraping jobs"
  ON scraping_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scraping jobs"
  ON scraping_jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for enrichment jobs
CREATE POLICY "Users can view their own enrichment jobs"
  ON enrichment_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrichment jobs"
  ON enrichment_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrichment jobs"
  ON enrichment_jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scraping_jobs_updated_at
  BEFORE UPDATE ON scraping_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrichment_jobs_updated_at
  BEFORE UPDATE ON enrichment_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON businesses(user_id);
CREATE INDEX IF NOT EXISTS businesses_siret_idx ON businesses(siret);
CREATE INDEX IF NOT EXISTS businesses_siren_idx ON businesses(siren);
CREATE INDEX IF NOT EXISTS businesses_city_idx ON businesses(city);
CREATE INDEX IF NOT EXISTS businesses_enrichment_status_idx ON businesses(enrichment_status);

CREATE INDEX IF NOT EXISTS scraping_jobs_user_id_idx ON scraping_jobs(user_id);
CREATE INDEX IF NOT EXISTS scraping_jobs_status_idx ON scraping_jobs(status);

CREATE INDEX IF NOT EXISTS enrichment_jobs_user_id_idx ON enrichment_jobs(user_id);
CREATE INDEX IF NOT EXISTS enrichment_jobs_status_idx ON enrichment_jobs(status);