import { create } from "zustand";

import axios from "axios";
("../components/types/jobsInterface");
import {
  NotificationState,
  Notification,
} from "./../components/types/notification";
import { ApiResponse } from "../components/types";
import { Activities } from "../components/types/jobsInterface";

const BASE_URL = import.meta.env.VITE_API_URL + "/notif";

export const useNotifStore = create<NotificationState>((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchNotif: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post<ApiResponse<Notification[]>>(
        `${BASE_URL}/get/all/`,
        id
      );
      const { data } = res.data;

      set({ data: data || [], isLoading: false });
      return data || [];
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return [];
    }
  },

  markAsRead: async (id: string, updates: Partial<Notification>) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put<ApiResponse<Notification>>(
        `${BASE_URL}/update-notif/${id}`,
        updates
      );
      const { data } = res.data;

      set((state) => ({
        notification: state.data.map((notif) =>
          notif.id === id ? { ...notif, ...data } : notif
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          (error as any).response.data.message || "Error updating Notification",
        isLoading: false,
      });
    }
  },

  getallActivities: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post<ApiResponse<Activities[]>>(
        `${BASE_URL}/activities/`,
        { id }
      );
      const { data } = res.data;

      set({ data: data || [], isLoading: false });
      return data || [];
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return [];
    }
  },
}));
