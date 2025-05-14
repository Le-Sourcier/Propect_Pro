// export interface JobStatus {
//   jobId: string;
//   status: string;
//   records: number;
//   enriched: number;
//   link: string;
// }

export interface Activities {
  id: string;
  type: string;
  label: string;
  createdAt: string;
}
export interface EnrichmentJobsProps {
  id: string;
  name: string;
  status: string;
  records: number;
  enriched: number;
  link: string;
  date: string;
  sources: string[];
}

export interface ScrapingJob {
  id: string;
  source: string;
  query: string;
  location: string;
  status: "pending" | "running" | "completed" | "failed";
  results: number;
  limite: number | null;
  createdAt: string;
  user_id: string;
}
export interface SelectedScrapingJob {
  id: string;
  result: SelectedScrapingJobResult[];
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

interface AllScrapingJob {
  id: string;
  name: string;
  source: string;
  location: string;
  status: string;
  date: string;
}
export interface AllJobResponse {
  error: Error | null;
  data: AllScrapingJob[];
}
export interface SelectedScrapingJobResult {
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
export interface ScrapingState {
  jobs: ScrapingJob[];
  allJobs?: AllJobResponse;
  selectedJob?: SelectedScrapingJob | null;
  isLoading: boolean;
  error: string | null;
  fetchJobs: (userId: string) => Promise<void>;
  fetchJobById: (jobId: string) => Promise<void>;
  createJob: (job: Partial<ScrapingJob>) => Promise<void>;
  updateJob: (id: string, updates: Partial<ScrapingJob>) => Promise<void>;
  getAllJobs: () => Partial<AllJobResponse>;
  deleteJob: (id: string) => Promise<void>;
  resetSelectedJob: () => void; // 👈 ajouter ceci
}

export interface ColumnConfig {
  key: string;
  label: string;
  accessor?: (item: SelectedScrapingJobResult) => string;
}
