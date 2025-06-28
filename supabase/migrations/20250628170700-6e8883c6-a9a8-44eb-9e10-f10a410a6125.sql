
-- Add password_reset_tokens table for secure password resets
CREATE TABLE public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user_sessions table to track login activity
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT
);

-- Add user_activity_logs table for admin tracking
CREATE TABLE public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for password_reset_tokens (only users can see their own tokens)
CREATE POLICY "Users can view their own reset tokens" 
  ON public.password_reset_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS policies for user_sessions (users can see their own sessions, admins can see all)
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS policies for user_activity_logs (only admins can see these)
CREATE POLICY "Admins can view all activity logs" 
  ON public.user_activity_logs 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  target_user_id UUID,
  action_type TEXT,
  action_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs (user_id, admin_user_id, action, details)
  VALUES (target_user_id, auth.uid(), action_type, action_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to get user with profile info (for admin dashboard)
CREATE OR REPLACE FUNCTION public.get_users_with_profiles(
  search_term TEXT DEFAULT NULL,
  role_filter TEXT DEFAULT NULL,
  status_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  email_confirmed_at TIMESTAMPTZ,
  banned_until TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND status = 'approved'
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
$$;

-- Add indexes for better performance
CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_admin_user_id ON public.user_activity_logs(admin_user_id);
