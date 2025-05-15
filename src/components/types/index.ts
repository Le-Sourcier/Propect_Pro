export interface ApiResponse<T> {
  error: boolean;
  status: number;
  message: string;
  data: T;
}

export interface ChartDataPoint {
  date: string;
  scraping: {
    completed: number;
    failed: number;
    pending: number;
  };
  enrichment: {
    completed: number;
    failed: number;
    pending: number;
  };
}

export interface PerformanceChartProps {
  data?: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  linkTo?: string;
  linkText?: string;
}

export type ViewMode = "both" | "scraping" | "enrichment";
