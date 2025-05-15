import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Notification } from "./../components/types/notification";
import { useNotifications } from "../hooks/useNotif";
import { useNotifStore } from "../stores/notification";
import useAuth from "../hooks/useAuth";
// import { generateMockNotifications } from "./mockData";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">
  ) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { fetchNotif } = useNotifStore();
  const { user } = useAuth();

  // Initialize with mock data
  useEffect(() => {
    const initializeNotifications = async () => {
      if (user) {
        const notifs = await fetchNotif(user?.id);
        setNotifications(notifs);
      }
    };
    initializeNotifications();

    // Simulate a new notification coming in after a delay
    const timer = setTimeout(() => {
      addNotification({
        message: "New message from Sarah",
        type: "info",
        avatar:
          "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2",
      });
    }, 15000); // After 15 seconds

    return () => clearTimeout(timer);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Add a new notification
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">
  ) => {
    const id = Math.random().toString(36).substring(2, 10);
    const newNotification: Notification = {
      id,
      timestamp: new Date(),
      isRead: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
