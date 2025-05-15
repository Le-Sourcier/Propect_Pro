import React, { useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../../hooks/useNotif";
import NotificationDropdown from "./NotificationDropdown";

const NotificationButton: React.FC = () => {
  const { unreadCount, isOpen, setIsOpen } = useNotifications();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="notification-button relative p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-gray-100"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
        id="notification-button"
      >
        <Bell className="h-6 w-6 text-gray-700" />

        {/* Notification badge */}
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-0.5 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse-subtle"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      <NotificationDropdown />
    </div>
  );
};

export default NotificationButton;
