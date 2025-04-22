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
    const { jobId, type, message, metadata } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get job and user details
    const { data: job } = await supabase
      .from('scraping_jobs')
      .select(`
        *,
        users:user_id (
          email
        )
      `)
      .eq('id', jobId)
      .single();

    if (!job) {
      throw new Error('Job not found');
    }

    // Store notification in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: job.user_id,
        type,
        message,
        metadata: {
          ...metadata,
          jobId,
          jobType: 'scraping',
          timestamp: new Date().toISOString()
        },
        read: false
      });

    if (notificationError) throw notificationError;

    // Send webhook if configured
    if (job.metadata?.webhook_url) {
      try {
        await fetch(job.metadata.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            message,
            job: {
              id: job.id,
              query: job.query,
              location: job.location,
              status: job.status,
              results: job.results
            },
            metadata
          })
        });
      } catch (error) {
        console.error('Webhook delivery failed:', error);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
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