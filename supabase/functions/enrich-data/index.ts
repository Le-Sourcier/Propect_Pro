import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { businessIds } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get businesses to enrich
    const { data: businesses, error: fetchError } = await supabase
      .from('businesses')
      .select('*')
      .in('id', businessIds)
      .eq('enrichment_status', 'pending');

    if (fetchError) throw fetchError;

    // Enrich each business
    const enrichedBusinesses = await Promise.all(
      businesses.map(async (business) => {
        const enrichedData = await enrichBusiness(business);
        
        // Update business with enriched data
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            ...enrichedData,
            enrichment_status: 'completed',
            last_enriched_at: new Date().toISOString()
          })
          .eq('id', business.id);

        if (updateError) throw updateError;

        return enrichedData;
      })
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: enrichedBusinesses.length,
        businesses: enrichedBusinesses 
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

async function enrichBusiness(business: any) {
  const enrichedData = { ...business };

  // Enrich with INSEE data if SIRET/SIREN is available
  if (business.siret || business.siren) {
    try {
      const inseeData = await fetchINSEEData(business);
      Object.assign(enrichedData, inseeData);
    } catch (error) {
      console.error('INSEE enrichment failed:', error);
    }
  }

  // Enrich with additional data sources
  try {
    const additionalData = await Promise.all([
      enrichFromSocieteCom(business),
      enrichFromLinkedIn(business),
      enrichFromGooglePlaces(business)
    ]);

    additionalData.forEach(data => {
      if (data) Object.assign(enrichedData, data);
    });
  } catch (error) {
    console.error('Additional enrichment failed:', error);
  }

  return enrichedData;
}

async function fetchINSEEData(business: any) {
  // INSEE API implementation
  return {};
}

async function enrichFromSocieteCom(business: any) {
  // Societe.com enrichment implementation
  return {};
}

async function enrichFromLinkedIn(business: any) {
  // LinkedIn enrichment implementation
  return {};
}

async function enrichFromGooglePlaces(business: any) {
  // Google Places enrichment implementation
  return {};
}