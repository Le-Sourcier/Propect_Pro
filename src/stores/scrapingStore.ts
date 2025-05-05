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
export interface SelectedScrapingJob {
  id: string;
  result: SelectedScrapingJobResult[] | [];
  createdAt: string;
}

interface Adresse {
  siret: string;
  siret_formate: string;
  nic: string;
  numero_voie: string | null;
  indice_repetition: string | null;
  type_voie: string | null;
  libelle_voie: string;
  complement_adresse: string | null;
  adresse_ligne_1: string;
  adresse_ligne_2: string | null;
  code_postal: string;
  code_commune: string;
  ville: string;
  pays: string;
  code_pays: string;
}

interface SelectedScrapingJobResult {
  // Identité de l'entreprise
  nom_entreprise: string;
  dirigeant: string;
  forme_juridique: string;
  categorie_juridique: string;
  type?: string; // optionnel car non dans ton exemple

  // Identifiants légaux
  siren_number: string;
  code_naf: string;

  // Adresse (imbriquée)
  siege: Adresse;

  // Infos supplémentaires que tu peux compléter plus tard
  phone_number?: string;
  website?: string;
  reviews?: number;
  stars?: number;
  link?: string;
}
interface ScrapingState {
  jobs: ScrapingJob[];
  selectedJob?: SelectedScrapingJob | null;
  isLoading: boolean;
  error: string | null;
  fetchJobs: (userId: string) => Promise<void>;
  fetchJobById: (jobId: string) => Promise<void>;
  createJob: (job: Partial<ScrapingJob>) => Promise<void>;
  updateJob: (id: string, updates: Partial<ScrapingJob>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  resetSelectedJob: () => void; // 👈 ajouter ceci
}

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
        }));
      } catch (err) {
        console.error("Erreur de parsing JSON du champ result :", err);
        data.result = []; // Pour éviter les crashs
      }

      set({ selectedJob: data, isLoading: false });
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
      await axios.delete(`${BASE_URL}/delete/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  resetSelectedJob: () => set({ selectedJob: null }), // 👈 ajouter ceci
}));
