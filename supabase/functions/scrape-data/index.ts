import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import puppeteer from 'npm:puppeteer-core@22.4.1';
import chromium from 'npm:@sparticuz/chromium@119.0.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function notifyUser(supabase: any, jobId: string, type: string, message: string, metadata: any = {}) {
  try {
    const { data: { url: functionUrl } } = await supabase.functions.invoke('notify', {
      body: JSON.stringify({ jobId, type, message, metadata })
    });
    return url;
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { source, query, location, maxResults = 100, jobId } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update job status to running and set started_at
    const startTime = new Date().toISOString();
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'running',
        started_at: startTime,
        progress: 0,
        retry_count: 0,
        metadata: { 
          lastAttempt: startTime,
          startTime: startTime
        }
      })
      .eq('id', jobId);

    await notifyUser(supabase, jobId, 'info', `Started scraping ${query} in ${location}`, {
      startTime,
      source,
      maxResults
    });

    // Initialize browser with stealth mode
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--disable-dev-shm-usage'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let results = [];
    let retryCount = 0;
    let success = false;

    while (retryCount < MAX_RETRIES && !success) {
      try {
        const page = await browser.newPage();
        
        // Set user agent and other stealth settings
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
        });

        switch (source) {
          case 'google-maps':
            results = await scrapeGoogleMaps(page, query, location, maxResults, supabase, jobId);
            break;
          case 'linkedin':
            results = await scrapeLinkedIn(page, query, location, maxResults, supabase, jobId);
            break;
          case 'yellow-pages':
            results = await scrapeYellowPages(page, query, location, maxResults, supabase, jobId);
            break;
          case 'societe-com':
            results = await scrapeSocieteCom(page, query, location, maxResults, supabase, jobId);
            break;
          default:
            throw new Error('Invalid source specified');
        }

        success = true;
      } catch (error) {
        retryCount++;
        console.error(`Attempt ${retryCount} failed:`, error);
        
        // Update job with error info
        const errorTime = new Date().toISOString();
        await supabase
          .from('scraping_jobs')
          .update({
            retry_count: retryCount,
            last_error: error.message,
            metadata: {
              lastAttempt: errorTime,
              lastError: error.message,
              retryCount
            }
          })
          .eq('id', jobId);

        await notifyUser(supabase, jobId, 'warning', `Scraping attempt ${retryCount} failed: ${error.message}`, {
          errorTime,
          retryCount,
          error: error.message
        });

        if (retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    await browser.close();

    if (!success) {
      const failureTime = new Date().toISOString();
      await supabase
        .from('scraping_jobs')
        .update({
          status: 'failed',
          completed_at: failureTime,
          metadata: {
            failureTime,
            totalAttempts: retryCount
          }
        })
        .eq('id', jobId);

      await notifyUser(supabase, jobId, 'error', `Scraping failed after ${retryCount} attempts`, {
        failureTime,
        totalAttempts: retryCount
      });

      throw new Error(`Failed after ${MAX_RETRIES} attempts`);
    }

    // Store results in businesses table
    if (results.length > 0) {
      const { error: insertError } = await supabase
        .from('businesses')
        .insert(results.map(result => ({
          ...result,
          data_sources: [source],
          enrichment_status: 'pending'
        })));

      if (insertError) throw insertError;
    }

    // Update job status to completed
    const completionTime = new Date().toISOString();
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        progress: 100,
        results: results.length,
        completed_at: completionTime,
        metadata: {
          finalResultCount: results.length,
          completionTime,
          executionTime: (new Date(completionTime).getTime() - new Date(startTime).getTime()) / 1000
        }
      })
      .eq('id', jobId);

    await notifyUser(supabase, jobId, 'success', `Successfully scraped ${results.length} results`, {
      completionTime,
      resultCount: results.length,
      executionTime: (new Date(completionTime).getTime() - new Date(startTime).getTime()) / 1000
    });

    return new Response(
      JSON.stringify({ success: true, count: results.length }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Scraping failed:', error);

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

[Previous scraping function implementations remain unchanged...]