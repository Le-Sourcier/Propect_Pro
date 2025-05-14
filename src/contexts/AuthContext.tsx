// import  secureLocalStorage from "react-secure-storage"
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ApiResponse,
  AuthContextType,
  RegisterProps,
  User,
  UserWithToken,
} from "../components/types/auth";
import toast from "react-hot-toast";
import { Activities } from "../components/types/jobsInterface";
const BASE_URL = import.meta.env.VITE_API_URL + "/user";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => Cookies.get("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => Cookies.get("refreshToken") || null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<ApiResponse<User>>(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(res.data.data);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      Cookies.remove("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        const res = await refreshAccessToken();
        if (!res.accessToken) {
          setLoading(false);
          return;
        }
      }
      await fetchUser();
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleAuthSuccess = (data: UserWithToken) => {
    Cookies.set("accessToken", data.accessToken, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", data.refreshToken, {
      secure: true,
      sameSite: "Strict",
    });
    setRefreshToken(data.refreshToken);
    console.log("refreshToken", data.refreshToken);

    setAccessToken(data.accessToken);
    setUser(data);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<UserWithToken>>(
        `${BASE_URL}/login`,
        {
          email,
          password,
        }
      );
      const { error, data: user, message } = res.data;

      handleAuthSuccess(user);
      if (error) {
        toast.error(message);
        return { error: new Error(message), data: null };
      }
      return { error: null, data: user };
    } catch (e) {
      let message;
      if (axios.isAxiosError(e)) {
        message = e.response?.data?.message;
      }
      toast.error(message || "Login failed");

      return { error: new Error(message || "Login failed"), data: null };
    } finally {
      setLoading(false);
    }
  };
  const sendPasswordOtp = async (
    email: string
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<null>>(
        `${BASE_URL}/send-password-otp`,
        {
          email,
        }
      );
      const { error, message } = res.data;

      if (error) {
        toast.error(message);
        return { error: new Error(message), data: null };
      }
      return { error: null, data: null };
    } catch (e) {
      let message;
      if (axios.isAxiosError(e)) {
        message = e.response?.data?.message;
      }
      toast.error(message || "OTP for password sending failed");

      return {
        error: new Error(message || "Password OTP sending failed"),
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };
  const verifyPasswordOTP = async (
    email: string,
    otp: string
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<null>>(
        `${BASE_URL}/verify-otp`,
        {
          email: email,
          code: otp,
        }
      );
      const { error, message } = res.data;

      if (error) {
        toast.error(message);
        return { error: new Error(message), data: null };
      }
      return { error: null, data: null };
    } catch (e) {
      let message;
      if (axios.isAxiosError(e)) {
        message = e.response?.data?.message;
      }
      toast.error(message || "Code verification failed");

      return {
        error: new Error(message || "Code verification failed"),
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };
  const passwordForgetting = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.put<ApiResponse<null>>(
        `${BASE_URL}/forget-password`,
        {
          email,
          password,
        }
      );
      const { error, message } = res.data;

      if (error) {
        toast.error(message);
        return { error: new Error(message), data: null };
      }
      return { error: null, data: null };
    } catch (e) {
      let message;
      if (axios.isAxiosError(e)) {
        message = e.response?.data?.message;
      }
      toast.error(message || "Login failed");

      return { error: new Error(message || "Login failed"), data: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    registerData: RegisterProps
  ): Promise<{ error: Error | null; data: any }> => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<UserWithToken>>(
        `${BASE_URL}/register`,
        {
          ...registerData,
        }
      );

      const { error, data, message } = res.data;

      if (error) {
        toast.error(`${message}`);

        return { error: new Error(message), data: null };
      }
      handleAuthSuccess(data);

      return { error: null, data: user };
    } catch (e) {
      let message;
      if (axios.isAxiosError(e)) {
        message = e.response?.data?.message;
      }
      toast.error(`${message}` || "Login failed");

      return { error: new Error(message || "Login failed"), data: null };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  const getAllActivities = async (): Promise<Activities[]> => {
    try {
      const id = user?.id;

      const res = await axios.post<ApiResponse<Activities[]>>(
        `${BASE_URL}/activities`,
        {
          method: "POST",
          body: JSON.stringify({ id }),
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { error, data, message } = res.data;
      if (error) {
        console.log("Error getting activities: ", message);
        return [];
      }
      return data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  };
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post<ApiResponse<{ token: string }>>(
        `${BASE_URL}/refresh/${refreshToken}`
      );

      const { error, data, message } = res.data;
      if (error || !data)
        throw new Error(message || "Erreur de rafraîchissement");

      console.log("Token rafraîchi avec succès !", data.token);

      Cookies.set("accessToken", data.token, {
        secure: true,
        sameSite: "Strict",
      });
      sessionStorage.setItem("accessToken", data.token);
      setAccessToken(data.token);

      return { error: null, accessToken: data.token };
    } catch (e) {
      console.error("Erreur lors du refresh token :", e);
      logout(); // Optionnel : déconnecter si le refresh échoue
      return {
        error: new Error("Échec de la régénération du token"),
        accessToken: null,
      };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        sendPasswordOtp,
        verifyPasswordOTP,
        passwordForgetting,
        signUp,
        getAllActivities,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
