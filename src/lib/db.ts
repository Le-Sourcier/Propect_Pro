// Frontend API client for database operations
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type DatabaseType = 'postgresql' | 'mysql' | 'mariadb';

export interface DatabaseConnection {
  type: DatabaseType;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  schema?: string;
  timezone?: string;
}

export const testConnection = async (connection: DatabaseConnection) => {
  const response = await fetch(`${API_BASE_URL}/api/database/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(connection)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Database connection test failed');
  }
  
  return true;
};

export const createBackup = async () => {
  const response = await fetch(`${API_BASE_URL}/api/database/backup`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Database backup failed');
  }
  return response.json();
};

export const getDatabaseStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/database/stats`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get database stats');
  }
  return response.json();
};

export const getTableColumns = async (tableName: string) => {
  const response = await fetch(`${API_BASE_URL}/api/database/tables/${tableName}/columns`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get table columns');
  }
  return response.json();
};

export const getTableIndexes = async (tableName: string) => {
  const response = await fetch(`${API_BASE_URL}/api/database/tables/${tableName}/indexes`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get table indexes');
  }
  return response.json();
};

export default {
  testConnection,
  createBackup,
  getDatabaseStats,
  getTableColumns,
  getTableIndexes,
};