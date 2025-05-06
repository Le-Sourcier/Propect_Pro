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
