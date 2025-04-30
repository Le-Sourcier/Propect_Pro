// import { supabase } from "../supabase";

// export interface ScrapingJob {
//   id: string;
//   source: "google-maps" | "linkedin" | "yellow-pages" | "societe-com";
//   query: string;
//   location: string;
//   maxResults?: number;
//   status: "pending" | "running" | "completed" | "failed";
//   progress: number;
//   results: any[];
//   error?: string;
// }

// export async function startScraping(job: Partial<ScrapingJob>) {
//   try {
//     // Create scraping job record
//     const { data: newJob, error: jobError } = await supabase
//       .from("scraping_jobs")
//       .insert({
//         source: job.source,
//         query: job.query,
//         location: job.location,
//         max_results: job.maxResults || 100,
//         status: "running",
//         progress: 0,
//       })
//       .select()
//       .single();

//     if (jobError) throw jobError;

//     // Start scraping process
//     const { data, error } = await supabase.functions.invoke("scrape-data", {
//       body: {
//         source: job.source,
//         query: job.query,
//         location: job.location,
//         maxResults: job.maxResults,
//       },
//     });

//     if (error) throw error;

//     // Update job with results
//     await supabase
//       .from("scraping_jobs")
//       .update({
//         status: "completed",
//         progress: 100,
//         results: data.businesses,
//         completed_at: new Date().toISOString(),
//       })
//       .eq("id", newJob.id);

//     return data;
//   } catch (error) {
//     logger.error("Scraping failed:", error);
//     throw error;
//   }
// }

// export async function enrichBusinesses(businessIds: string[]) {
//   try {
//     const { data, error } = await supabase.functions.invoke("enrich-data", {
//       body: { businessIds },
//     });

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     logger.error("Enrichment failed:", error);
//     throw error;
//   }
// }

// export async function getScrapingJob(jobId: string) {
//   const { data, error } = await supabase
//     .from("scraping_jobs")
//     .select("*")
//     .eq("id", jobId)
//     .single();

//   if (error) throw error;
//   return data;
// }

// export async function listScrapingJobs(userId: string) {
//   const { data, error } = await supabase
//     .from("scraping_jobs")
//     .select("*")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// }
