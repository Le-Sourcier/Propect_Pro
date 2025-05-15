import React from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import {
  formatRelativeTime,
  getTypeColor,
} from "../../utils/notificationTimeParser";
import { NotificationItemProps } from "../../types/notification";

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const { message, timestamp, type, isRead, avatar } = notification;

  // Get type icon
  const getTypeIcon = () => {
    switch (type) {
      case "info":
        return <Info size={16} className="text-blue-500" />;
      case "success":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "error":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div
      className={`
        flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 
        transition-colors duration-200 cursor-pointer
        ${!isRead ? "bg-blue-50" : ""}
      `}
      onClick={onMarkAsRead}
    >
      {/* Left dot indicator for unread notifications */}
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
      )}

      {/* Avatar or icon */}
      <div className="mr-3 flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
              type
            )}`}
          >
            {getTypeIcon()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <p
          className={`text-sm mb-1 ${
            !isRead ? "font-medium" : "text-gray-700"
          }`}
        >
          {message}
        </p>
        <p className="text-xs text-gray-500">
          {formatRelativeTime(new Date(timestamp))}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
