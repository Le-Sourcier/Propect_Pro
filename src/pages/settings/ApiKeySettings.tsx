import React, { useState } from 'react';
import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ApiKeySettings = () => {
  const [showProductionKey, setShowProductionKey] = useState(false);
  const [showTestKey, setShowTestKey] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  return (
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
                  {showProductionKey ? 'pk_live_123456789abcdef' : '••••••••••••••••••••••••••••••'}
                </span>
                <button
                  onClick={() => setShowProductionKey(!showProductionKey)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  {showProductionKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => copyToClipboard('pk_live_123456789abcdef')}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <button className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 border border-red-200 rounded hover:bg-red-50">
              Revoke
            </button>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Test Key</h5>
              <div className="mt-1 flex items-center">
                <span className="text-xs text-gray-500 font-mono">
                  {showTestKey ? 'pk_test_123456789abcdef' : '••••••••••••••••••••••••••••••'}
                </span>
                <button
                  onClick={() => setShowTestKey(!showTestKey)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  {showTestKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => copyToClipboard('pk_test_123456789abcdef')}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <button className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 border border-red-200 rounded hover:bg-red-50">
              Revoke
            </button>
          </div>
        </div>

        <button className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
          <RefreshCw size={14} className="mr-1.5" />
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

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900">Documentation</h4>
        <p className="mt-1 text-sm text-gray-500">
          Learn how to integrate our API into your applications.
        </p>

        <div className="mt-4 space-y-2">
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800"
          >
            Quick Start Guide →
          </a>
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800"
          >
            API Reference →
          </a>
          <a
            href="#"
            className="block text-sm text-blue-600 hover:text-blue-800"
          >
            Example Code →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;