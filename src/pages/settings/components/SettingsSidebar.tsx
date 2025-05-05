import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Users, Key, Database, Mail, Bell, Shield } from 'lucide-react';

const menuItems = [
  { path: 'account', label: 'Account', icon: User },
  { path: 'team', label: 'Team', icon: Users },
  { path: 'api', label: 'API Keys', icon: Key },
  { path: 'database', label: 'Database', icon: Database },
  { path: 'email', label: 'Email Settings', icon: Mail },
  { path: 'notifications', label: 'Notifications', icon: Bell },
  { path: 'privacy', label: 'Privacy & Security', icon: Shield },
];

const SettingsSidebar = () => {
  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
      <nav className="py-4 md:py-8 px-4 md:px-6 space-y-1">
        {menuItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;