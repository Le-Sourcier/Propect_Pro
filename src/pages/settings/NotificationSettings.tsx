import React from 'react';
import { Bell, Mail, MessageSquare, Calendar } from 'lucide-react';

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">Choose how and when you want to be notified.</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="scraping"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="scraping" className="text-sm font-medium text-gray-700">
                Scraping Job Updates
              </label>
              <p className="text-xs text-gray-500">Get notified when scraping jobs are completed</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enrichment"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="enrichment" className="text-sm font-medium text-gray-700">
                Data Enrichment Updates
              </label>
              <p className="text-xs text-gray-500">Receive notifications about enrichment job status</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="campaigns"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="campaigns" className="text-sm font-medium text-gray-700">
                Campaign Reports
              </label>
              <p className="text-xs text-gray-500">Daily and weekly campaign performance reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">System Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="security"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="security" className="text-sm font-medium text-gray-700">
                Security Alerts
              </label>
              <p className="text-xs text-gray-500">Important security-related notifications</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="updates"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="updates" className="text-sm font-medium text-gray-700">
                Product Updates
              </label>
              <p className="text-xs text-gray-500">New features and improvements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Channels</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
            <Mail className="h-5 w-5 text-gray-400" />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
            <Bell className="h-5 w-5 text-gray-400" />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <p className="text-xs text-gray-500">Browser notifications enabled</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">Slack</label>
              <p className="text-xs text-gray-500">Not connected</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">Calendar</label>
              <p className="text-xs text-gray-500">Not connected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;