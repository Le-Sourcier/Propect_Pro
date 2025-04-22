import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GarminConnect } from 'npm:garmin-connect';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    const GCClient = new GarminConnect();
    await GCClient.login(email, password);

    const userInfo = await GCClient.getUserInfo();
    const activities = await GCClient.getActivities(0, 10);

    return new Response(
      JSON.stringify({
        userInfo,
        activities,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});