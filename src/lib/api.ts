const API_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    fetchApi("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    fetchApi("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getProfile: () => fetchApi("/api/users/profile"),

  updateProfile: (data: any) =>
    fetchApi("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Businesses
export const businesses = {
  create: (data: any) =>
    fetchApi("/api/businesses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (userId: string) => fetchApi(`/api/businesses/${userId}`),

  update: (id: string, data: any) =>
    fetchApi(`/api/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string, userId: string) =>
    fetchApi(`/api/businesses/${id}?userId=${userId}`, {
      method: "DELETE",
    }),
};

// Scraping Jobs
export const scraping = {
  create: (data: any) =>
    fetchApi("/api/scraping/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (userId: string) => fetchApi(`/api/scraping/jobs/${userId}`),

  getStatus: (jobId: string) => fetchApi(`/api/scraping/jobs/${jobId}/status`),
};

// Enrichment Jobs
export const enrichment = {
  create: (data: any) =>
    fetchApi("/api/enrichment/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (userId: string) => fetchApi(`/api/enrichment/jobs/${userId}`),

  getStatus: (jobId: string) =>
    fetchApi(`/api/enrichment/jobs/${jobId}/status`),
};

// Database Operations
export const database = {
  test: (connection: any) =>
    fetchApi("/api/database/test", {
      method: "POST",
      body: JSON.stringify(connection),
    }),

  backup: () => fetchApi("/api/database/backup"),

  stats: () => fetchApi("/api/database/stats"),

  getTableColumns: (tableName: string) =>
    fetchApi(`/api/database/tables/${tableName}/columns`),

  getTableIndexes: (tableName: string) =>
    fetchApi(`/api/database/tables/${tableName}/indexes`),
};

export default {
  auth,
  businesses,
  scraping,
  enrichment,
  database,
};
