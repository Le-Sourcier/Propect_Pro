import { create } from "zustand";

import axios from "axios";
import {
  AllJobResponse,
  ScrapingJob,
  ScrapingState,
} from "../components/types/jobsInterface";
import useAuth from "../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_API_URL + "/job";

export const useScrapingStore = create<ScrapingState>((set) => ({
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

  fetchJobById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`${BASE_URL}/single/` + id);
      let { data } = res.data;

      try {
        // data.result = data.result.entreprises;

        data.result = data.result.map((e: any) => ({
          nom_entreprise: e.nom_entreprise,
          dirigeant: e.dirigeant,
          forme_juridique: e.forme_juridique,
          categorie_juridique: e.categorie_juridique,
          siren_number: e.siren_number,
          code_naf: e.code_naf,
          siege: e.siege,
          // Add these fields from the API response
          phone_number: e.phone_number,
          website: e.website,
          reviews: e.reviews,
          stars: e.stars,
          link: e.link,
        }));
      } catch (err) {
        console.error("Erreur de parsing JSON du champ result :", err);
        data.result = []; // Pour éviter les crashs
      }

      set({ selectedJob: data, isLoading: false });
    } catch (error) {
      set({
        error: (error as any).response.data.message || "Error fetching job",
        isLoading: false,
      });
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
      set({
        error: (error as any).response.data.message || "Error creating job",
        isLoading: false,
      });
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
      set({
        error: (error as any).response.data.message || "Error updating job",
        isLoading: false,
      });
    }
  },

  getAllJobs: async () => {
    const { user } = useAuth();

    try {
      set({ isLoading: true, error: null });
      const res = await axios.get<AllJobResponse>(
        `${BASE_URL}/all/${user?.id} `
      );
      const { error, data } = res.data;
      // set({ allJobs: data || [], isLoading: false });
      return { error, data };
    } catch (error) {
      set({
        error: (error as any).response.data.message || "Error fetching jobs",
        isLoading: false,
      });
    }
  },
  deleteJob: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: (error as any).response.data.message || "Error deleting job",
        isLoading: false,
      });
    }
  },
  resetSelectedJob: () => set({ selectedJob: null }), // 👈 ajouter ceci
}));
