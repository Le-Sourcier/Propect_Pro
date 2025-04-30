import React from "react";
import { NavLink } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Search,
  Database,
  // Mail,
  Settings,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ease-linear duration-300 lg:hidden ${
          open ? "opacity-100 bg-gray-600/75" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-900">ProspectPro</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4">
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              end
            >
              <LayoutDashboard size={20} className="mr-3" />
              Dashboard
            </NavLink>

            <NavLink
              to="/scraping"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Search size={20} className="mr-3" />
              Scraping
            </NavLink>

            <NavLink
              to="/enrichment"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Database size={20} className="mr-3" />
              Enrichment
            </NavLink>

            {/* <NavLink
              to="/email-campaigns"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Mail size={20} className="mr-3" />
              Email Campaigns
            </NavLink> */}

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Settings size={20} className="mr-3" />
              Settings
            </NavLink>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={() => logout()}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
