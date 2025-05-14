import { Activities } from "./jobsInterface";

export interface UserWithToken extends User {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  error: boolean;
  status: number;
  message: string;
  data: T;
}

export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  phone: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; data: User | null }>;
  sendPasswordOtp: (
    email: string
  ) => Promise<{ error: Error | null; data: any }>;
  verifyPasswordOTP: (
    email: string,
    otp: string
  ) => Promise<{ error: Error | null; data: any }>;
  passwordForgetting: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; data: any }>;
  signUp: (data: RegisterProps) => Promise<{ error: Error | null; data: any }>;
  getAllActivities: () => Promise<Activities[] | []>;
  logout: () => void;
}

export interface RegisterProps {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: File | null;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  agree_to_terms: boolean;
}
