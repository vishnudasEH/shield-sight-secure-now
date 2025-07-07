
-- Fix the ambiguous status column reference in the admin check
CREATE OR REPLACE FUNCTION public.get_users_with_profiles(
  search_term text DEFAULT NULL::text, 
  role_filter text DEFAULT NULL::text, 
  status_filter text DEFAULT NULL::text, 
  limit_count integer DEFAULT 50, 
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  user_id uuid, 
  email text, 
  first_name text, 
  last_name text, 
  role text, 
  status text, 
  created_at timestamp with time zone, 
  last_sign_in_at timestamp with time zone, 
  email_confirmed_at timestamp with time zone, 
  banned_until timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND profiles.role = 'admin' AND profiles.status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email,
    p.first_name,
    p.last_name,
    p.role,
    p.status,
    au.created_at,
    au.last_sign_in_at,
    au.email_confirmed_at,
    au.banned_until
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE 
    (search_term IS NULL OR 
     au.email ILIKE '%' || search_term || '%' OR
     p.first_name ILIKE '%' || search_term || '%' OR
     p.last_name ILIKE '%' || search_term || '%')
    AND (role_filter IS NULL OR p.role = role_filter)
    AND (status_filter IS NULL OR p.status = status_filter)
  ORDER BY au.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$function$
