import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface ScrapingJob {
  id: string;
  source: string;
  query: string;
  location: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: number;
  date: string;
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
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ jobs: data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createJob: async (job: Partial<ScrapingJob>) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('scraping_jobs')
        .insert([job])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ 
        jobs: [data, ...state.jobs],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateJob: async (id: string, updates: Partial<ScrapingJob>) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('scraping_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        jobs: state.jobs.map(job => job.id === id ? { ...job, ...data } : job),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteJob: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('scraping_jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        jobs: state.jobs.filter(job => job.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));