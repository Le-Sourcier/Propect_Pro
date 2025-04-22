import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import mysql from "mysql2/promise";
const router = express.Router();

// Test database connection with provided credentials
router.post("/test", async (req, res) => {
  const {
    type,
    host,
    port,
    database,
    username,
    password,
    ssl,
    schema,
    timezone,
  } = req.body;

  try {
    let connection;

    if (type === "postgresql") {
      const pool = new Pool({
        host,
        port: parseInt(port),
        database,
        user: username,
        password,
        ssl: ssl ? { rejectUnauthorized: false } : false,
        schema: schema || "public",
      });

      const client = await pool.connect();
      await client.query("SELECT NOW()");
      client.release();
      await pool.end();
    } else if (type === "mysql" || type === "mariadb") {
      connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        database,
        user: username,
        password,
        ssl: ssl ? { rejectUnauthorized: false } : false,
        timezone: timezone || "UTC",
      });

      await connection.execute("SELECT NOW()");
      await connection.end();
    } else {
      throw new Error("Unsupported database type");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({
      error: "Database connection test failed",
      message: error.message,
    });
  }
});

// Create database backup
router.get("/backup", async (req, res) => {
  const pool = new Pool({
    host: process.env.PG_HOST || "161.97.96.229",
    port: parseInt(process.env.PG_PORT || "5432"),
    database: process.env.PG_DATABASE || "user24",
    user: process.env.PG_USER || "user24",
    password: process.env.PG_PASSWORD || "wRNsmT7E82eEzfeD",
    ssl: false,
  });

  const client = await pool.connect();
  try {
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const backupData = {};

    // Backup each table's data and structure
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;

      // Get table structure
      const structureResult = await client.query(
        `
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
      `,
        [tableName]
      );

      // Get table data
      const dataResult = await client.query(`SELECT * FROM ${tableName}`);

      backupData[tableName] = {
        structure: structureResult.rows,
        data: dataResult.rows,
      };
    }

    res.json(backupData);
  } catch (error) {
    console.error("Database backup failed:", error);
    res.status(500).json({
      error: "Database backup failed",
      message: error.message,
    });
  } finally {
    client.release();
    await pool.end();
  }
});

// Get database stats
router.get("/stats", async (req, res) => {
  const pool = new Pool({
    host: process.env.PG_HOST || "161.97.96.229",
    port: parseInt(process.env.PG_PORT || "5432"),
    database: process.env.PG_DATABASE || "user24",
    user: process.env.PG_USER || "user24",
    password: process.env.PG_PASSWORD || "wRNsmT7E82eEzfeD",
    ssl: false,
  });

  const client = await pool.connect();
  try {
    // Get table sizes and row counts
    const result = await client.query(`
      SELECT 
        schemaname as schema,
        tablename as table,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as raw_size,
        n_live_tup as row_count,
        pg_size_pretty(pg_table_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
        pg_stat_get_last_autovacuum_time(schemaname||'.'||tablename::regclass) as last_vacuum
      FROM pg_tables 
      JOIN pg_stat_user_tables ON tablename = relname
      WHERE schemaname = 'public'
      ORDER BY raw_size DESC
    `);

    // Get database size
    const dbSizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as total_size
    `);

    // Get connection info
    const connectionResult = await client.query(`
      SELECT count(*) as active_connections 
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `);

    res.json({
      tables: result.rows,
      database_size: dbSizeResult.rows[0].total_size,
      active_connections: connectionResult.rows[0].active_connections,
    });
  } catch (error) {
    console.error("Failed to get database stats:", error);
    res.status(500).json({
      error: "Failed to get database stats",
      message: error.message,
    });
  } finally {
    client.release();
    await pool.end();
  }
});

// Get table columns
router.get("/tables/:tableName/columns", async (req, res) => {
  const pool = new Pool({
    host: process.env.PG_HOST || "161.97.96.229",
    port: parseInt(process.env.PG_PORT || "5432"),
    database: process.env.PG_DATABASE || "user24",
    user: process.env.PG_USER || "user24",
    password: process.env.PG_PASSWORD || "wRNsmT7E82eEzfeD",
    ssl: false,
  });

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        column_default,
        is_nullable,
        udt_name,
        is_identity,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `,
      [req.params.tableName]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to get table columns:", error);
    res.status(500).json({
      error: "Failed to get table columns",
      message: error.message,
    });
  } finally {
    client.release();
    await pool.end();
  }
});

// Get table indexes
router.get("/tables/:tableName/indexes", async (req, res) => {
  const pool = new Pool({
    host: process.env.PG_HOST || "161.97.96.229",
    port: parseInt(process.env.PG_PORT || "5432"),
    database: process.env.PG_DATABASE || "user24",
    user: process.env.PG_USER || "user24",
    password: process.env.PG_PASSWORD || "wRNsmT7E82eEzfeD",
    ssl: false,
  });

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        i.relname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique,
        ix.indisprimary as is_primary,
        am.amname as index_type
      FROM
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a,
        pg_am am
      WHERE
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND i.relam = am.oid
        AND t.relkind = 'r'
        AND t.relname = $1
      ORDER BY
        i.relname
    `,
      [req.params.tableName]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to get table indexes:", error);
    res.status(500).json({
      error: "Failed to get table indexes",
      message: error.message,
    });
  } finally {
    client.release();
    await pool.end();
  }
});

export default router;
