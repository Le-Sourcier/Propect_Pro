import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Base URLs for your API endpoints
const API_URL = import.meta.env.VITE_API_URL;
const USER_BASE = API_URL + "/user";

/**
 * User shape as returned by the backend.
 */
export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  phone: string;
}

/**
 * Result type for login/signup
 */
interface AuthResult {
  error: Error | null;
  data: User | null;
}

/**
 * Shape of the Auth context.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phone: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType>(null!);

// Configure axios defaults
axios.defaults.withCredentials = true;

/**
 * Helper to generate a fresh Axios instance with interceptors.
 */
const createAxios = (
  getAccessToken: () => string | null,
  setAccessToken: (token: string) => void,
  logout: () => void
): AxiosInstance => {
  const instance = axios.create({
    baseURL: USER_BASE,
    withCredentials: true,
  });

  // Attach access token to requests
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    return config;
  });

  // On 401, try refreshing
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        try {
          const refreshRes = await axios.get(USER_BASE + "/refresh");
          const newToken = (refreshRes.data as any).accessToken;
          setAccessToken(newToken);

          const originalConfig = error.config as InternalAxiosRequestConfig;
          originalConfig.headers = originalConfig.headers ?? {};
          (originalConfig.headers as Record<string, string>)[
            "Authorization"
          ] = `Bearer ${newToken}`;

          return instance.request(originalConfig);
        } catch {
          logout();
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * The AuthProvider component.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await axios.post(USER_BASE + "/logout");
    } catch {
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  // On mount, attempt to refresh token once using REFRESH_URL
  useEffect(() => {
    (async () => {
      try {
        const refreshRes = await axios.get(USER_BASE + "/refresh");

        const newToken = (refreshRes.data as any).accessToken;
        setAccessToken(newToken);

        const authAxios = createAxios(() => newToken, setAccessToken, logout);
        const meRes = await authAxios.get<Partial<User>>("/me");
        setUser(meRes.data as User);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const res = await axios.post(USER_BASE + "/login", { email, password });

      const payload = (res.data as any).data;
      const userData: User = {
        id: payload.id,
        email: payload.email,
        fname: payload.firstName,
        lname: payload.lastName,
        phone: payload.phone,
      };
      setAccessToken(payload.accessToken);
      // logger.log("New token: ", payload.accessToken);

      setUser(userData);
      return { error: null, data: userData };
    } catch (err: any) {
      return { error: err, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fname: string,
    lname: string,
    phone: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const res = await axios.post(USER_BASE + "/register", {
        email,
        password,
        fname,
        lname,
        phone,
      });
      const payload = (res.data as any).data;
      const userData: User = {
        id: payload.id,
        email: payload.email,
        fname: payload.firstName,
        lname: payload.lastName,
        phone: payload.phone,
      };
      setAccessToken(payload.accessToken);
      setUser(userData);
      return { error: null, data: userData };
    } catch (err: any) {
      return { error: err, data: null };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, login, signUp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL + "/user";

// export interface User {
//   id: string;
//   email: string;
//   fname: string;
//   lname: string;
//   phone: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   accessToken: string | null;
//   login: (
//     email: string,
//     password: string
//   ) => Promise<{ error: Error | null; data: any }>;
//   signUp: (
//     email: string,
//     password: string,
//     fname: string,
//     lname: string,
//     phone: string
//   ) => Promise<{ error: Error | null; data: any }>;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(() =>
//     localStorage.getItem("accessToken")
//   );
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await axios.get(`${BASE_URL}/me`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setUser(res.data);
//       } catch (err) {
//         setUser(null);
//         setAccessToken(null);
//         localStorage.removeItem("accessToken");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [accessToken]);

//   const login = async (
//     email: string,
//     password: string
//   ): Promise<{ error: Error | null; data: any }> => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${BASE_URL}/login`, { email, password });
//       const { data: user } = res.data;

//       localStorage.setItem("accessToken", user.accessToken);
//       localStorage.setItem("refreshToken", user.refreshToken);
//       setAccessToken(user.accessToken);
//       setUser(user);

//       return { error: null, data: user };
//     } catch (error: any) {
//       return { error, data: null };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (
//     email: string,
//     password: string,
//     fname: string,
//     lname: string,
//     phone: string
//   ): Promise<{ error: Error | null; data: any }> => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${BASE_URL}/register`, {
//         email,
//         password,
//         fname,
//         lname,
//         phone,
//       });

//       const { data: user } = res.data;

//       localStorage.setItem("accessToken", user.accessToken);
//       localStorage.setItem("refreshToken", user.refreshToken);
//       setAccessToken(user.accessToken);
//       setUser(user);

//       return { error: null, data: user };
//     } catch (error: any) {
//       return { error, data: null };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setAccessToken(null);
//     setUser(null);
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         accessToken,
//         login,
//         signUp,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
