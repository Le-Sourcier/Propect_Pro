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
  ) => Promise<{ error: Error | null; data: any }>;
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
  signUp: (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phone: string
  ) => Promise<{ error: Error | null; data: any }>;
  getAllActivities: () => Promise<Activities[] | []>;
  logout: () => void;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  phone?: string;
  profileImage?: File;
}

export type ValidationErrors = Partial<Record<keyof RegistrationData, string>>;
export type TouchedFields = Partial<Record<keyof RegistrationData, boolean>>;
