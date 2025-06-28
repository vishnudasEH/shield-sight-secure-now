
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ManageUserRequest {
  action: 'ban' | 'unban' | 'reset_password' | 'change_role' | 'confirm_user';
  userId: string;
  newPassword?: string;
  newRole?: string;
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

    const { action, userId, newPassword, newRole }: ManageUserRequest = await req.json();

    if (!action || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing ${action} for user:`, userId);

    let result;
    let message;

    switch (action) {
      case 'ban':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, { ban: true });
        message = "User has been banned successfully";
        break;
        
      case 'unban':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, { ban: false });
        message = "User has been unbanned successfully";
        break;
        
      case 'reset_password':
        if (!newPassword) {
          return new Response(
            JSON.stringify({ success: false, error: "New password is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
        result = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
        message = "User password has been reset successfully";
        break;
        
      case 'change_role':
        if (!newRole) {
          return new Response(
            JSON.stringify({ success: false, error: "New role is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
        result = await supabaseAdmin
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);
        message = `User role has been changed to ${newRole} successfully`;
        break;
        
      case 'confirm_user':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });
        if (!result.error) {
          await supabaseAdmin
            .from('profiles')
            .update({ status: 'approved' })
            .eq('id', userId);
        }
        message = "User has been confirmed successfully";
        break;
        
      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid action" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }

    if (result.error) {
      console.error(`Error during ${action}:`, result.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to ${action}: ${result.error.message}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Log the activity
    await supabaseAdmin.rpc('log_user_activity', {
      target_user_id: userId,
      action_type: action,
      action_details: { 
        admin_id: user.id,
        ...(newPassword && { password_reset: true }),
        ...(newRole && { new_role: newRole })
      }
    });

    console.log(`${action} completed successfully for user:`, userId);

    return new Response(
      JSON.stringify({
        success: true,
        message: message
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Unexpected error in manage-user function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred during user management"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
