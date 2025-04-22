import React from 'react';

const EmailSettings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Email Settings</h2>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure your email settings and preferences.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="smtp-server" className="block text-sm font-medium text-gray-700">
                  SMTP Server
                </label>
                <input
                  type="text"
                  id="smtp-server"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="smtp.example.com"
                />
              </div>

              <div>
                <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="number"
                  id="smtp-port"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="587"
                />
              </div>

              <div>
                <label htmlFor="email-from" className="block text-sm font-medium text-gray-700">
                  From Email Address
                </label>
                <input
                  type="email"
                  id="email-from"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="noreply@yourdomain.com"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;