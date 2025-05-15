import React, { useRef, useEffect } from "react";
import { useNotifications } from "../../../hooks/useNotif";
import NotificationItem from "./NotificationItem";

const NotificationDropdown: React.FC = () => {
  const { notifications, isOpen, setIsOpen, markAsRead, markAllAsRead } =
    useNotifications();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".notification-button")
      ) {
        setIsOpen(false);
      }
    };

    // Handle ESC key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, setIsOpen]);

  // Focus trap for keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    // Get all focusable elements
    const focusableElements = dropdown.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    // Set initial focus
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // If shift + tab and on first element, loop to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // If tab and on last element, loop to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    dropdown.addEventListener("keydown", handleTabKey);
    return () => dropdown.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50 transform origin-top-right transition-all duration-200"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: `scale(${isOpen ? 1 : 0.95}) translateY(${
          isOpen ? 0 : -10
        }px)`,
      }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="notification-button"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-700">Notifications</h3>
        <button
          hidden={notifications.length === 0}
          onClick={markAllAsRead}
          className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          aria-label="Mark all as read"
        >
          Mark all as read
        </button>
      </div>

      {/* Notification list */}
      <div className="divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 text-center border-t border-gray-100">
        <button
          className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          aria-label="View all notifications"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
