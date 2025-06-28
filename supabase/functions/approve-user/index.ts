
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ApproveUserRequest {
  requestId: string;
  userData: {
    email: string;
    first_name: string;
    last_name: string;
  };
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
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create regular client for checking user permissions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify the requesting user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ success: false, error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin' || profile.status !== 'approved') {
      console.error('Authorization error:', profileError);
      return new Response(
        JSON.stringify({ success: false, error: "Admin access required" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { requestId, userData }: ApproveUserRequest = await req.json();

    if (!requestId || !userData) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Processing approval for request:', requestId);

    // Create user account using Supabase Auth Admin API with service role
    const { data: authData, error: authCreationError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: 'TempPass123!', // Temporary password - user should reset
      email_confirm: true, // Confirm email immediately
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
      }
    });

    if (authCreationError) {
      console.error('Auth user creation error:', authCreationError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to create user account: ${authCreationError.message}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create user - no user data returned"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Additional confirmation step - ensure user is properly activated
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      authData.user.id,
      {
        email_confirm: true,
        ban: false
      }
    );

    if (confirmError) {
      console.error('User confirmation error:', confirmError);
      // Don't return error here as user was already created successfully
      console.log('User created but confirmation step failed - user should still be able to log in');
    } else {
      console.log('User email confirmed successfully');
    }

    // Create profile using admin client
    const { error: profileCreationError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: 'user',
        status: 'approved'
      });

    if (profileCreationError) {
      console.error('Profile creation error:', profileCreationError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to create user profile: ${profileCreationError.message}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update signup request status using admin client
    const { error: updateError } = await supabaseAdmin
      .from('signup_requests')
      .update({ 
        status: 'approved',
        processed_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('Signup request update error:', updateError);
      // Don't return error here as user was already created successfully
    }

    console.log('User approval completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${userData.first_name} ${userData.last_name} has been approved and can now log in`,
        temporaryPassword: 'TempPass123!'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Unexpected error in approve-user function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred during user approval"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
