// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export interface Database {
//   public: {
//     Tables: {
//       businesses: {
//         Row: {
//           id: string
//           created_at: string
//           updated_at: string
//           user_id: string
//           name: string
//           siret: string | null
//           siren: string | null
//           website: string | null
//           phone: string | null
//           email: string | null
//           address: string | null
//           city: string | null
//           postal_code: string | null
//           country: string
//           latitude: number | null
//           longitude: number | null
//           business_type: string | null
//           naf_code: string | null
//           employee_count: number | null
//           annual_revenue: number | null
//           google_maps_url: string | null
//           google_rating: number | null
//           google_reviews_count: number | null
//           google_place_id: string | null
//           data_sources: string[] | null
//           last_enriched_at: string | null
//           enrichment_status: string
//         }
//         Insert: {
//           id?: string
//           created_at?: string
//           updated_at?: string
//           user_id: string
//           name: string
//           siret?: string | null
//           siren?: string | null
//           website?: string | null
//           phone?: string | null
//           email?: string | null
//           address?: string | null
//           city?: string | null
//           postal_code?: string | null
//           country?: string
//           latitude?: number | null
//           longitude?: number | null
//           business_type?: string | null
//           naf_code?: string | null
//           employee_count?: number | null
//           annual_revenue?: number | null
//           google_maps_url?: string | null
//           google_rating?: number | null
//           google_reviews_count?: number | null
//           google_place_id?: string | null
//           data_sources?: string[] | null
//           last_enriched_at?: string | null
//           enrichment_status?: string
//         }
//         Update: {
//           id?: string
//           created_at?: string
//           updated_at?: string
//           user_id?: string
//           name?: string
//           siret?: string | null
//           siren?: string | null
//           website?: string | null
//           phone?: string | null
//           email?: string | null
//           address?: string | null
//           city?: string | null
//           postal_code?: string | null
//           country?: string
//           latitude?: number | null
//           longitude?: number | null
//           business_type?: string | null
//           naf_code?: string | null
//           employee_count?: number | null
//           annual_revenue?: number | null
//           google_maps_url?: string | null
//           google_rating?: number | null
//           google_reviews_count?: number | null
//           google_place_id?: string | null
//           data_sources?: string[] | null
//           last_enriched_at?: string | null
//           enrichment_status?: string
//         }
//       }
//       scraping_jobs: {
//         Row: {
//           id: string
//           created_at: string
//           updated_at: string
//           user_id: string
//           query: string
//           location: string
//           max_results: number
//           use_proxy: boolean
//           proxy_url: string | null
//           status: string
//           progress: number
//           total_results: number
//           successful_results: number
//           error_count: number
//           error_message: string | null
//           results_file_url: string | null
//           completed_at: string | null
//         }
//         Insert: {
//           id?: string
//           created_at?: string
//           updated_at?: string
//           user_id: string
//           query: string
//           location: string
//           max_results?: number
//           use_proxy?: boolean
//           proxy_url?: string | null
//           status?: string
//           progress?: number
//           total_results?: number
//           successful_results?: number
//           error_count?: number
//           error_message?: string | null
//           results_file_url?: string | null
//           completed_at?: string | null
//         }
//         Update: {
//           id?: string
//           created_at?: string
//           updated_at?: string
//           user_id?: string
//           query?: string
//           location?: string
//           max_results?: number
//           use_proxy?: boolean
//           proxy_url?: string | null
//           status?: string
//           progress?: number
//           total_results?: number
//           successful_results?: number
//           error_count?: number
//           error_message?: string | null
//           results_file_url?: string | null
//           completed_at?: string | null
//         }
//       }
//       enrichment_jobs: {
//         Row: {
//           id: string
//           created_at: string
//           updated_at: string
//           user_id: string
//           name: string
//           description: string | null
//           source_file_url: string | null
//           use_insee: boolean
//           use_societe_com: boolean
//           use_linkedin: boolean
//           status: string
//           progress: number
//           total_records: number
//           enriched_records: number
//           error_count: number
//           error_message: string | null
//           results_file_url: string | null
//           completed_at: string | null
//         }
//         Insert: {
//           id?: string
//           created_at?: string
//           updated_at?: string
//           user_id: string
//           name: string
//           description?: string | null
//           source_file_url?: string | null
//           use_insee?: boolean
//           use_societe_com?: boolean
//           use_linkedin?: boolean
//           status?: string
//           progress?: number
//           total_records?: number
//           enriched_records?: number
//           error_count?: number
//           error_message?: string | null
//           results_file_url?: string | null
//           completed_at?: string | null
//         }
//         Update: {
//           id?: string
//           created_at?: string
//           updated_at?: string
//           user_id?: string
//           name?: string
//           description?: string | null
//           source_file_url?: string | null
//           use_insee?: boolean
//           use_societe_com?: boolean
//           use_linkedin?: boolean
//           status?: string
//           progress?: number
//           total_records?: number
//           enriched_records?: number
//           error_count?: number
//           error_message?: string | null
//           results_file_url?: string | null
//           completed_at?: string | null
//         }
//       }
//     }
//   }
// }
