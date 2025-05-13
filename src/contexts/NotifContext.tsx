import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Activities } from "../components/types/jobsInterface";

const BASE_URL = import.meta.env.VITE_API_URL + "/user";

type NotifContextType = {
  activities: Activities[];
  loading: boolean;
  refreshActivities: () => Promise<void>;
};

export const NotifContext = createContext<NotifContextType | undefined>(
  undefined
);

export const NotifProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activities, setActivities] = useState<Activities[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshActivities = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");

      const response = await axios.get<{ data: Activities[] }>(
        `${BASE_URL}/activities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivities(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des activités :", error);
      toast.error("Impossible de charger les activités récentes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshActivities();
  }, [refreshActivities]);

  return (
    <NotifContext.Provider
      value={{
        activities,
        loading,
        refreshActivities,
      }}
    >
      {children}
    </NotifContext.Provider>
  );
};
