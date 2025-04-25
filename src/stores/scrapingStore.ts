import { create } from "zustand";

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL + "/job";

export interface ScrapingJob {
  id: string;
  source: string;
  query: string;
  location: string;
  status: "pending" | "running" | "completed" | "failed";
  results: number;
  createdAt: string;
  user_id: string;
}

interface ScrapingState {
  jobs: ScrapingJob[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: (userId: string) => Promise<void>;
  createJob: (job: Partial<ScrapingJob>) => Promise<void>;
  updateJob: (id: string, updates: Partial<ScrapingJob>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useScrapingStore = create<ScrapingState>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`${BASE_URL}/get/` + userId);
      const { data } = res.data;

      set({ jobs: data || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createJob: async (job: Partial<ScrapingJob>) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axios.post(`${BASE_URL}/create`, { ...job });
      const { data: jobData } = res.data;

      set((state) => ({
        jobs: [jobData, ...state.jobs],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateJob: async (id: string, updates: Partial<ScrapingJob>) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.put(`${BASE_URL}/update/${id}`, updates);
      const { data } = res.data;

      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? { ...job, ...data } : job
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteJob: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.put(`${BASE_URL}/delete/${id}`);
      // const { data } = res.data;

      // if (error) throw error;
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
