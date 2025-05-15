import { Activities } from "./jobsInterface";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  message: string;
  timestamp: string | number | Date;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  avatar?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
}

export interface NotificationState {
  data: Notification[] | Activities[];
  isLoading: boolean;
  error: string | null;
  fetchNotif: (id: string) => Promise<Notification[]>;
  markAsRead: (id: string, updates: Partial<Notification>) => Promise<void>;
  getallActivities: (id: string) => Promise<Activities[]>;
}
