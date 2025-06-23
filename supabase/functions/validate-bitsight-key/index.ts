
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ValidateBitsightKeyRequest {
  apiKey: string;
}

interface ValidateBitsightKeyResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { apiKey }: ValidateBitsightKeyRequest = await req.json();

    if (!apiKey || !apiKey.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "API key is required"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Validating Bitsight API key...');

    // Call Bitsight API from the server-side
    const bitsightResponse = await fetch('https://api.bitsighttech.com/ratings/v1/companies', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Lovable-Bitsight-Integration/1.0'
      }
    });

    console.log('Bitsight API response status:', bitsightResponse.status);

    if (bitsightResponse.ok) {
      console.log('API key validated successfully');
      return new Response(
        JSON.stringify({
          success: true,
          message: "API key validated successfully"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else if (bitsightResponse.status === 401) {
      console.log('API key validation failed: Unauthorized');
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid API key. Please check your token and try again."
        }),
        {
          status: 200, // Return 200 to frontend, but with error in response
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else if (bitsightResponse.status === 403) {
      console.log('API key validation failed: Forbidden');
      return new Response(
        JSON.stringify({
          success: false,
          error: "API key lacks required permissions. Please check your access level."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      console.log('API key validation failed with status:', bitsightResponse.status);
      const errorText = await bitsightResponse.text().catch(() => 'Unknown error');
      return new Response(
        JSON.stringify({
          success: false,
          error: `API validation failed with status ${bitsightResponse.status}. Please try again.`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

  } catch (error) {
    console.error('Network error during API validation:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Network error occurred while validating API key. Please check your connection and try again."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
