import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.VITE_PG_HOST || 'postgresql-lesourcier.alwaysdata.net',
  port: parseInt(process.env.VITE_PG_PORT || '5432'),
  database: process.env.VITE_PG_DATABASE || 'lesourcier_prospectpro',
  user: process.env.VITE_PG_USER || 'lesourcier',
  password: process.env.VITE_PG_PASSWORD || 'Lesourcier@91680967',
  ssl: false,
});

// Initialize database tables
const initializeTables = async () => {
  const client = await pool.connect();
  try {
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text UNIQUE NOT NULL,
        password text NOT NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
    `);

    // Check if tables exist
    const tablesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'businesses'
      );
    `);

    if (!tablesExist.rows[0].exists) {
      // Create businesses table
      await client.query(`
        CREATE TABLE IF NOT EXISTS businesses (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now(),
          user_id uuid,
          name text NOT NULL,
          siret text,
          siren text,
          website text,
          phone text,
          email text,
          address text,
          city text,
          postal_code text,
          country text DEFAULT 'France',
          latitude numeric,
          longitude numeric,
          business_type text,
          naf_code text,
          employee_count int,
          annual_revenue numeric,
          google_maps_url text,
          google_rating numeric,
          google_reviews_count int,
          google_place_id text,
          data_sources text[] DEFAULT '{}',
          last_enriched_at timestamptz,
          enrichment_status text DEFAULT 'pending',
          CONSTRAINT unique_siret UNIQUE NULLS NOT DISTINCT (siret),
          CONSTRAINT unique_siren UNIQUE NULLS NOT DISTINCT (siren)
        );

        CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON businesses(user_id);
        CREATE INDEX IF NOT EXISTS businesses_siret_idx ON businesses(siret);
        CREATE INDEX IF NOT EXISTS businesses_siren_idx ON businesses(siren);
        CREATE INDEX IF NOT EXISTS businesses_city_idx ON businesses(city);
        CREATE INDEX IF NOT EXISTS businesses_enrichment_status_idx ON businesses(enrichment_status);

        ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own businesses"
          ON businesses FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own businesses"
          ON businesses FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own businesses"
          ON businesses FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
      `);

      // Create scraping_jobs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS scraping_jobs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now(),
          user_id uuid,
          query text NOT NULL,
          location text NOT NULL,
          max_results int DEFAULT 100,
          use_proxy boolean DEFAULT false,
          proxy_url text,
          status text DEFAULT 'pending',
          progress numeric DEFAULT 0,
          total_results int DEFAULT 0,
          successful_results int DEFAULT 0,
          error_count int DEFAULT 0,
          error_message text,
          results_file_url text,
          completed_at timestamptz
        );

        CREATE INDEX IF NOT EXISTS scraping_jobs_user_id_idx ON scraping_jobs(user_id);
        CREATE INDEX IF NOT EXISTS scraping_jobs_status_idx ON scraping_jobs(status);

        ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own scraping jobs"
          ON scraping_jobs FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own scraping jobs"
          ON scraping_jobs FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own scraping jobs"
          ON scraping_jobs FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
      `);

      // Create enrichment_jobs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS enrichment_jobs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now(),
          user_id uuid,
          name text NOT NULL,
          description text,
          source_file_url text,
          use_insee boolean DEFAULT true,
          use_societe_com boolean DEFAULT false,
          use_linkedin boolean DEFAULT false,
          status text DEFAULT 'pending',
          progress numeric DEFAULT 0,
          total_records int DEFAULT 0,
          enriched_records int DEFAULT 0,
          error_count int DEFAULT 0,
          error_message text,
          results_file_url text,
          completed_at timestamptz
        );

        CREATE INDEX IF NOT EXISTS enrichment_jobs_user_id_idx ON enrichment_jobs(user_id);
        CREATE INDEX IF NOT EXISTS enrichment_jobs_status_idx ON enrichment_jobs(status);

        ALTER TABLE enrichment_jobs ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own enrichment jobs"
          ON enrichment_jobs FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own enrichment jobs"
          ON enrichment_jobs FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own enrichment jobs"
          ON enrichment_jobs FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
      `);

      // Create updated_at triggers
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

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
      `);

      console.log('Database tables initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Initialize tables when the module is loaded
initializeTables().catch(console.error);

// User operations
export const createUser = async (email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Businesses
export const createBusiness = async (data) => {
  const result = await pool.query(
    `INSERT INTO businesses (
      user_id, name, siret, siren, website, phone, email,
      address, city, postal_code, country, latitude, longitude,
      business_type, naf_code, employee_count, annual_revenue,
      google_maps_url, google_rating, google_reviews_count, google_place_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
    RETURNING *`,
    [
      data.user_id,
      data.name,
      data.siret,
      data.siren,
      data.website,
      data.phone,
      data.email,
      data.address,
      data.city,
      data.postal_code,
      data.country,
      data.latitude,
      data.longitude,
      data.business_type,
      data.naf_code,
      data.employee_count,
      data.annual_revenue,
      data.google_maps_url,
      data.google_rating,
      data.google_reviews_count,
      data.google_place_id
    ]
  );
  return result.rows[0];
};

export const getBusinesses = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM businesses WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

// Database operations
export const testConnection = async (connection) => {
  const testPool = new Pool({
    host: connection.host,
    port: parseInt(connection.port),
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.ssl ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await testPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    await testPool.end();
    return true;
  } catch (error) {
    throw error;
  }
};

export const createBackup = async () => {
  const client = await pool.connect();
  try {
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const backupData = {};
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      const structureResult = await client.query(`
        SELECT 
          column_name, 
          data_type, 
          character_maximum_length, 
          is_nullable,
          column_default,
          udt_name,
          is_identity
        FROM information_schema.columns
        WHERE table_name = $1
      `, [tableName]);
      
      const dataResult = await client.query(`SELECT * FROM ${tableName}`);
      
      backupData[tableName] = {
        structure: structureResult.rows,
        data: dataResult.rows
      };
    }
    
    return backupData;
  } finally {
    client.release();
  }
};

// Scraping jobs
export const createScrapingJob = async (data) => {
  const result = await pool.query(
    `INSERT INTO scraping_jobs (
      user_id, query, location, max_results, use_proxy, proxy_url
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.user_id,
      data.query,
      data.location,
      data.max_results,
      data.use_proxy,
      data.proxy_url
    ]
  );
  return result.rows[0];
};

export const getScrapingJobs = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM scraping_jobs WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

// Enrichment jobs
export const createEnrichmentJob = async (data) => {
  const result = await pool.query(
    `INSERT INTO enrichment_jobs (
      user_id, name, description, source_file_url,
      use_insee, use_societe_com, use_linkedin
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.user_id,
      data.name,
      data.description,
      data.source_file_url,
      data.use_insee,
      data.use_societe_com,
      data.use_linkedin
    ]
  );
  return result.rows[0];
};

export const getEnrichmentJobs = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM enrichment_jobs WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export default {
  query: (text, params) => pool.query(text, params),
  createUser,
  getUserByEmail,
  getUserById,
  createBusiness,
  getBusinesses,
  testConnection,
  createBackup,
  createScrapingJob,
  getScrapingJobs,
  createEnrichmentJob,
  getEnrichmentJobs,
};