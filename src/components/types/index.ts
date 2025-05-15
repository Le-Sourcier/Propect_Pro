export interface ApiResponse<T> {
  error: boolean;
  status: number;
  message: string;
  data: T;
}
