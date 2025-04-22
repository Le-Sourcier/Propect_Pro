import React, { useState } from 'react';
import { useGarmin } from '../../hooks/useGarmin';
import { Activity, Watch } from 'lucide-react';

const GarminSettings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { connect, isConnecting } = useGarmin();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    await connect({ email, password });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Garmin Connect</h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your Garmin device to automatically track your activities
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Garmin Connect Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Garmin Connect Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Watch className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Garmin Device'}
          </button>
        </form>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Benefits</h4>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center text-sm text-gray-500">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Automatic activity tracking
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Detailed workout analytics
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Progress tracking and insights
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GarminSettings;