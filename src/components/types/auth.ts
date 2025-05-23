export interface UserWithToken extends User {
  accessToken: string;
  refreshToken: string;
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
  resetPassword: (
    token: string,
    password: string,
    confirmpassword: string
  ) => Promise<{ error: Error | null; data: any }>;
  verifyMail: (
    token: string
  ) => Promise<{ error: Error | null; data: { firstName: string | null } }>;
  reSendVerifyMail: (email: string) => Promise<{ error: Error | null }>;
  verifyPasswordToken: (
    token: string
  ) => Promise<{ error: Error | null; data: { firstName: string | null } }>;
  passwordForgetting: (
    email: string
  ) => Promise<{ error: Error | null; data: any }>;
  signUp: (data: RegisterProps) => Promise<{ error: Error | null; data: any }>;
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
