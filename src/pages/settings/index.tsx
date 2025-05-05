import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingsSidebar from './components/SettingsSidebar';

const Settings = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row">
        <SettingsSidebar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;