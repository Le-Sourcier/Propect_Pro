import React, { useState } from 'react';
import { Save, Key, Database, Mail, Shield, User, Users, Bell, Lock, Eye, EyeOff, AlertTriangle, History, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDatabase } from '../hooks/useDatabase';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [showApiKey, setShowApiKey] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('sk_test_51NxXXXXXXXXXXXXXXXXXXXXX');
  const [editingTeamMember, setEditingTeamMember] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [connection, setConnection] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: false
  });
  const { 
    isConnecting, 
    isBackingUp, 
    dbStats, 
    testConnection, 
    createBackup, 
    loadDatabaseStats 
  } = useDatabase();

  // Mock security audit logs
  const auditLogs = [
    { id: 1, event: 'Login attempt', status: 'success', ip: '192.168.1.1', location: 'Paris, France', timestamp: '2024-03-19 14:23:45' },
    { id: 2, event: 'Password changed', status: 'success', ip: '192.168.1.1', location: 'Paris, France', timestamp: '2024-03-18 10:15:30' },
    { id: 3, event: 'Failed login attempt', status: 'failed', ip: '45.23.126.89', location: 'Unknown', timestamp: '2024-03-17 22:45:12' },
    { id: 4, event: 'API key generated', status: 'success', ip: '192.168.1.1', location: 'Paris, France', timestamp: '2024-03-15 16:30:00' },
  ];

  const handleMfaToggle = () => {
    setMfaEnabled(!mfaEnabled);
    toast.success(`Two-factor authentication ${!mfaEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleBiometricToggle = () => {
    setBiometricEnabled(!biometricEnabled);
    toast.success(`Biometric authentication ${!biometricEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleApiKeyToggle = () => {
    setShowApiKey(!showApiKey);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  const handleRevokeApiKey = () => {
    toast.success('API key revoked successfully');
    setApiKey('');
  };

  const handleGenerateNewKey = () => {
    const newKey = 'sk_test_' + Math.random().toString(36).substring(2);
    setApiKey(newKey);
    toast.success('New API key generated');
  };

  const handleSaveChanges = () => {
    toast.success('Settings saved successfully');
  };

  const handleSignOutAllDevices = () => {
    toast.success('Signed out from all devices');
  };

  const handleRevokeSession = (sessionType: string) => {
    toast.success(`${sessionType} session revoked`);
  };

  const handleExportLog = () => {
    const csvContent = auditLogs
      .map(log => `${log.event},${log.status},${log.location},${log.timestamp}`)
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-audit-log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Security audit log exported');
  };

  const handleEditTeamMember = (email: string) => {
    setEditingTeamMember(email);
    toast.success(`Editing team member: ${email}`);
  };

  const resetConnection = () => {
    setConnection({
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      ssl: false
    });
    toast.success('Connection settings reset to default');
  };

  const updateConnection = (field: string, value: string | boolean) => {
    setConnection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveConnection = () => {
    toast.success('Connection settings saved successfully');
  };

  // Add the missing handleRequestDeletion function
  const handleRequestDeletion = () => {
    const confirmed = window.confirm(
      'Are you sure you want to request account deletion? This action cannot be undone.'
    );
    
    if (confirmed) {
      toast.success('Account deletion request submitted. Our team will contact you shortly.');
    }
  };

  // Add the missing handleTestConnection function
  const handleTestConnection = async () => {
    try {
      await testConnection(connection);
      toast.success('Connection test successful');
    } catch (error) {
      toast.error('Connection test failed');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
          <nav className="py-4 md:py-8 px-4 md:px-6 space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'account'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              Account
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'team'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Team
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'api'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Key className="h-5 w-5 mr-3" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'database'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Database className="h-5 w-5 mr-3" />
              Database
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'email'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Mail className="h-5 w-5 mr-3" />
              Email Settings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'privacy'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              Privacy & Security
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                <p className="mt-1 text-sm text-gray-500">Update your account settings and profile information.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Profile Picture</h4>
                    <div className="mt-2 flex space-x-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Upload new image
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      defaultValue="John"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      defaultValue="Doe"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="john@example.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    defaultValue="Acme Inc."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Team Management</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your team members and their access levels.</p>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">John Doe</div>
                          <div className="text-sm text-gray-500">john@example.com</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Admin
                        </span>
                        <button
                          onClick={() => handleEditTeamMember('john@example.com')}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Edit</span>
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Invite New Team Member</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your API keys for external integrations.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Your API Keys</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Keep your API keys secure. Never share them in publicly accessible areas.
                </p>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Production Key</h5>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500 font-mono">
                          {showApiKey ? apiKey : '••••••••••••••••••••••••••••••'}
                        </span>
                        <button
                          onClick={handleApiKeyToggle}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          {showApiKey ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={handleCopyApiKey}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleRevokeApiKey}
                      className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 border border-red-200 rounded hover:bg-red-50"
                    >
                      Revoke
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerateNewKey}
                  className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Generate New Key
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">API Usage</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Track your API usage and limits.
                </p>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Monthly Usage</span>
                    <span>3,254 / 5,000 requests</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
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
                <div className="mt-4 space-y-4">
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
                      placeholder="e.g., 5432"
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
                      onClick={handleTestConnection}
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
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Database Size</p>
                      <p className="text-xs text-gray-500">{dbStats?.database_size || 'Loading...'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Active Connections</p>
                      <p className="text-xs text-gray-500">{dbStats?.active_connections || '0'}</p>
                    </div>
                  </div>

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

                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Recent Backups</h5>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500">backup_2024_03_19.json</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500">backup_2024_03_18.json</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                      </div>
                    </div>
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
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Configure your email server settings and templates.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">SMTP Configuration</h4>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SMTP Server</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Port</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleTestConnection}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Test Connection
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Email Templates</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Welcome Email</h5>
                      <p className="text-xs text-gray-500">Sent to new users upon registration</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Password Reset</h5>
                      <p className="text-xs text-gray-500">Sent when users request a password reset</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications and alerts.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="scraping-complete"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="scraping-complete" className="font-medium text-gray-700">
                        Scraping Job Completed
                      </label>
                      <p className="text-gray-500">Get notified when a scraping job is finished</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enrichment-complete"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enrichment-complete" className="font-medium text-gray-700">
                        Data Enrichment Completed
                      </label>
                      <p className="text-gray-500">Receive updates when data enrichment is done</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="campaign-status"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="campaign-status" className="font-medium text-gray-700">
                        Campaign Status Updates
                      </label>
                      <p className="text-gray-500">Get notified about email campaign progress</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">System Alerts</h4>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="security-alerts"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="security-alerts" className="font-medium text-gray-700">
                        Security Alerts
                      </label>
                      <p className="text-gray-500">Important security-related notifications</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="maintenance"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="maintenance" className="font-medium text-gray-700">
                        Maintenance Updates
                      </label>
                      <p className="text-gray-500">Scheduled maintenance and system updates</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Desktop Notifications</h4>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    Enable Desktop Notifications
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    Allow browser notifications to receive real-time updates
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Privacy & Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account security and data privacy preferences.
                </p>
              </div>

              {/* Account Security */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Account Security</h4>
                
                <div className="space-y-4">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={handleMfaToggle}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          mfaEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Biometric Authentication */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Biometric Authentication</p>
                        <p className="text-xs text-gray-500">Use fingerprint or face recognition to sign in</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={handleBiometricToggle}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          biometricEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Password Requirements</h5>
                    <ul className="space-y-1 text-xs text-gray-500">
                      <li className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                        Minimum 12 characters
                      </li>
                      <li className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                        Mix of uppercase and lowercase letters
                      </li>
                      <li className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-green-500">✓</span>
                        At least one number and special character
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                  <button
                    onClick={handleSignOutAllDevices}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Sign Out All Devices
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Session</p>
                        <p className="text-xs text-gray-500">Paris, France • Chrome on MacOS</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession('Current')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Revoke
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mobile App</p>
                        <p className="text-xs text-gray-500">iPhone 13 • iOS 15.4</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeSession('Mobile')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Audit Log */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Security Audit Log</h4>
                  <button
                    onClick={handleExportLog}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Log
                  </button>
                </div>
                
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.event}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Protection */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Data Protection</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="data-collection"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="data-collection" className="font-medium text-gray-700">
                        Data Collection
                      </label>
                      <p className="text-gray-500">Allow collection of usage data to improve our services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="third-party"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="third-party" className="font-medium text-gray-700">
                        Third-Party Data Sharing
                      </label>
                      <p className="text-gray-500">Share data with trusted partners for service improvement</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="backup"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="backup" className="font-medium text-gray-700">
                        Automatic Backups
                      </label>
                      <p className="text-gray-500">Keep your data safe with daily automated backups</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleRequestDeletion}
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Request Account Deletion
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;