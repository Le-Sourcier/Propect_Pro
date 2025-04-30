import { create } from "zustand";

import axios from "axios";
import { EnrichmentJobsProps } from "../components/interface/jobsInterface";
import toast from "react-hot-toast";
import { logger } from "../components/utils/logger";

const BASE_URL = import.meta.env.VITE_API_URL + "/job/enrich";

interface EnrichState {
  jobs: EnrichmentJobsProps[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: (userId: string) => Promise<void>;
  createJob: (formData: FormData) => Promise<any>;
  updateJob: (
    id: string,
    updates: Partial<EnrichmentJobsProps>
  ) => Promise<void>;
  downloadFile: (id: string) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useErichStore = create<EnrichState>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post(`${BASE_URL}/get-all`, { user_id: userId });
      const { data } = res.data;

      set({ jobs: data || [], isLoading: false });
    } catch (error) {
      // set({ error: (error as Error).message, isLoading: false });
      logger.error(
        "Erreur lors de la recuperation des données enrichies:",
        error
      );

      let message = "Erreur lors de la recuperation des données enrichies:";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }

      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  createJob: async (formData: FormData) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axios.post(`${BASE_URL}/mapping`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res || !res.data) {
        return toast.error("Données du job manquantes dans la réponse");
      }

      const jobData = res?.data?.data;

      logger.log("Job data:", jobData);

      set((state) => ({
        jobs: [jobData, ...state.jobs],
        isLoading: false,
      }));

      toast.success(res.data.message);

      return jobData;
    } catch (error) {
      logger.error("Erreur lors de la création du job:", error);

      let message = "Erreur lors de la création du job.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }

      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  updateJob: async (id: string, updates: Partial<EnrichmentJobsProps>) => {
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
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  downloadFile: async (fileId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/${fileId}`);

      // Création d’un lien pour déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileId); // nom du fichier à sauvegarder
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error(`Erreur de téléchargement : ${error}`);
    }
  },
}));
