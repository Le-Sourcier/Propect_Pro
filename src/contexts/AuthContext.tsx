import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL + "/user";

export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: (
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
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      const { data: user } = res.data;

      localStorage.setItem("accessToken", user.accessToken);
      localStorage.setItem("refreshToken", user.refreshToken);
      setAccessToken(user.accessToken);
      setUser(user);

      return { error: null, data: user };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      console.error("Login error:", error);

      return { error: message, data: null };
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
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        email,
        password,
        fname,
        lname,
        phone,
      });

      const { data: user } = res.data;

      localStorage.setItem("accessToken", user.accessToken);
      localStorage.setItem("refreshToken", user.refreshToken);
      setAccessToken(user.accessToken);
      setUser(user);

      return { error: null, data: user };
    } catch (error: any) {
      const message = error.response?.data?.message || "Register failed";

      return { error: message, data: null };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
