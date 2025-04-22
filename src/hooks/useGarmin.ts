import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface GarminCredentials {
  email: string;
  password: string;
}

export function useGarmin() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  const connect = async (credentials: GarminCredentials) => {
    setIsConnecting(true);
    try {
      const { data: { url: functionUrl } } = await supabase
        .functions.invoke('garmin-connect', {
          body: JSON.stringify(credentials)
        });

      const response = await fetch(functionUrl);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setActivities(data.activities);
      toast.success('Successfully connected to Garmin');
      return data;
    } catch (error) {
      toast.error('Failed to connect to Garmin: ' + error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const { data: { url: functionUrl } } = await supabase
        .functions.invoke('garmin-connect');

      const response = await fetch(functionUrl);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setActivities(data.activities);
      return data.activities;
    } catch (error) {
      toast.error('Failed to fetch activities: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connect,
    fetchActivities,
    activities,
    isConnecting,
    isLoading
  };
}