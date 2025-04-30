// export interface JobStatus {
//   jobId: string;
//   status: string;
//   records: number;
//   enriched: number;
//   link: string;
// }

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
