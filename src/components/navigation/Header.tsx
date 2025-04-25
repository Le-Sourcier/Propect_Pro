import React from "react";
import { Menu, Bell, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold text-gray-800">
                ProspectPro
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <Bell size={20} />
            </button>
            <div className="relative">
              <button className="flex items-center text-sm bg-gray-100 text-gray-700 rounded-full p-1 focus:outline-none hover:bg-gray-200">
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="hidden md:block ml-2 mr-2">
                  {user?.email?.split("@")[0] || "User"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
