import React from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';
import { useDatabase } from '../../hooks/useDatabase';

const DatabaseSettings = () => {
  const {
    connection,
    isConnecting,
    isBackingUp,
    isLoadingStats,
    dbStats,
    showPassword,
    connectionError,
    updateConnection,
    resetConnection,
    testConnection,
    saveConnection,
    createBackup,
    loadDatabaseStats,
    setShowPassword,
    DATABASE_TYPES
  } = useDatabase();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Database Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Configure your database connection and manage data.</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-900">Connection Settings</h4>
          <div className="space-x-2">
            <button
              onClick={resetConnection}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reset to Default
            </button>
          </div>
        </div>

        {connectionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{connectionError}</p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Database Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={connection.type}
              onChange={(e) => updateConnection('type', e.target.value)}
            >
              {DATABASE_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Host</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={connection.host}
              onChange={(e) => updateConnection('host', e.target.value)}
              placeholder="e.g., localhost or database.example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Port</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={connection.port}
              onChange={(e) => updateConnection('port', e.target.value)}
              placeholder={`e.g., ${DATABASE_TYPES.find(t => t.id === connection.type)?.defaultPort}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Database Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={connection.database}
              onChange={(e) => updateConnection('database', e.target.value)}
              placeholder="e.g., myapp_db"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={connection.username}
              onChange={(e) => updateConnection('username', e.target.value)}
              placeholder="Database username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                value={connection.password}
                onChange={(e) => updateConnection('password', e.target.value)}
                placeholder="Database password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {connection.type === 'postgresql' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Schema</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={connection.schema}
                onChange={(e) => updateConnection('schema', e.target.value)}
                placeholder="e.g., public"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ssl"
              checked={connection.ssl}
              onChange={(e) => updateConnection('ssl', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ssl" className="ml-2 block text-sm text-gray-700">
              Enable SSL/TLS connection
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={testConnection}
              disabled={isConnecting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isConnecting ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={saveConnection}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-900">Database Management</h4>
          <button
            onClick={loadDatabaseStats}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Refresh Statistics
          </button>
        </div>

        <div className="space-y-4">
          {dbStats && (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Database Size</p>
                <p className="text-xs text-gray-500">{dbStats.database_size}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Active Connections</p>
                <p className="text-xs text-gray-500">{dbStats.active_connections}</p>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={createBackup}
              disabled={isBackingUp}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isBackingUp ? 'Creating Backup...' : 'Backup Database'}
            </button>
          </div>

          {dbStats?.tables && dbStats.tables.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Table Statistics</h5>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rows</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Vacuum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dbStats.tables.map((table, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{table.table}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{table.size}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{table.row_count}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {table.last_vacuum ? new Date(table.last_vacuum).toLocaleDateString() : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseSettings;