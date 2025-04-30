import { useState } from "react";
import db from "../lib/db";
import toast from "react-hot-toast";

export type DatabaseType = "postgresql" | "mysql" | "mariadb";

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

export interface DatabaseStats {
  tables: Array<{
    table: string;
    size: string;
    row_count: number;
    table_size: string;
    index_size: string;
    last_vacuum: string;
  }>;
  database_size: string;
  active_connections: number;
}

export interface TableColumn {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  column_default: string | null;
  is_nullable: string;
}

export interface TableIndex {
  index_name: string;
  column_name: string;
  is_unique: boolean;
  is_primary: boolean;
}

const defaultConnection: DatabaseConnection = {
  type: "postgresql",
  host: import.meta.env.VITE_PG_HOST || "161.97.96.229",
  port: import.meta.env.VITE_PG_PORT || "5432",
  database: import.meta.env.VITE_PG_DATABASE || "user24",
  username: import.meta.env.VITE_PG_USER || "user24",
  password: import.meta.env.VITE_PG_PASSWORD || "",
  ssl: false,
  schema: "public",
  timezone: "UTC",
};

export const DATABASE_TYPES = [
  {
    id: "postgresql",
    name: "PostgreSQL",
    defaultPort: "5432",
    icon: "🐘",
  },
  {
    id: "mysql",
    name: "MySQL",
    defaultPort: "3306",
    icon: "🐬",
  },
  {
    id: "mariadb",
    name: "MariaDB",
    defaultPort: "3306",
    icon: "🐋",
  },
];

export const useDatabase = () => {
  const [connection, setConnection] =
    useState<DatabaseConnection>(defaultConnection);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [tableIndexes, setTableIndexes] = useState<TableIndex[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const updateConnection = (
    field: keyof DatabaseConnection,
    value: string | boolean
  ) => {
    setConnection((prev) => {
      const updated = { ...prev, [field]: value };

      // Update port when database type changes
      if (field === "type") {
        const dbType = DATABASE_TYPES.find((t) => t.id === value);
        if (dbType) {
          updated.port = dbType.defaultPort;
        }
      }

      return updated;
    });
    setConnectionError(null);
  };

  const resetConnection = () => {
    setConnection(defaultConnection);
    setConnectionError(null);
  };

  const validateConnection = (): boolean => {
    if (!connection.host.trim()) {
      setConnectionError("Host is required");
      return false;
    }
    if (!connection.port.trim()) {
      setConnectionError("Port is required");
      return false;
    }
    if (!connection.database.trim()) {
      setConnectionError("Database name is required");
      return false;
    }
    if (!connection.username.trim()) {
      setConnectionError("Username is required");
      return false;
    }
    return true;
  };

  const testConnection = async () => {
    if (!validateConnection()) {
      return false;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      await db.testConnection(connection);
      toast.success("Database connection successful");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Database connection failed";
      setConnectionError(errorMessage);
      toast.error(errorMessage);
      // logger.log("Connection error:", errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const saveConnection = async () => {
    if (!validateConnection()) {
      return false;
    }

    try {
      // Here you would typically save the connection details to your configuration
      toast.success("Connection settings saved successfully");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save connection settings";
      toast.error(errorMessage);
      return false;
    }
  };

  const createBackup = async () => {
    setIsBackingUp(true);
    try {
      const backupData = await db.createBackup();

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Database backup created successfully");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create database backup";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsBackingUp(false);
    }
  };

  const loadDatabaseStats = async () => {
    setIsLoadingStats(true);
    try {
      const stats = await db.getDatabaseStats();
      setDbStats(stats);
      return stats;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load database statistics";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadTableDetails = async (tableName: string) => {
    try {
      setSelectedTable(tableName);
      const [columns, indexes] = await Promise.all([
        db.getTableColumns(tableName),
        db.getTableIndexes(tableName),
      ]);
      setTableColumns(columns);
      setTableIndexes(indexes);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load table details";
      toast.error(errorMessage);
    }
  };

  return {
    connection,
    isConnecting,
    isBackingUp,
    isLoadingStats,
    dbStats,
    selectedTable,
    tableColumns,
    tableIndexes,
    showPassword,
    connectionError,
    updateConnection,
    resetConnection,
    testConnection,
    saveConnection,
    createBackup,
    loadDatabaseStats,
    loadTableDetails,
    setShowPassword,
    DATABASE_TYPES,
  };
};
