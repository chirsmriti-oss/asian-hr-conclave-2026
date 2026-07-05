CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  email CITEXT NOT NULL UNIQUE CHECK (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.admins
  WHERE id = auth.uid()
    AND status = 'active'
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = auth.uid()
      AND status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_admin_role() = 'super_admin'
$$;

REVOKE ALL ON public.admins FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admins TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

DROP POLICY IF EXISTS "Admins can read own profile and super admins can read all" ON public.admins;
CREATE POLICY "Admins can read own profile and super admins can read all"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING ((id = auth.uid() AND status = 'active') OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can insert admins" ON public.admins;
CREATE POLICY "Super admins can insert admins"
  ON public.admins
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can update admins" ON public.admins;
CREATE POLICY "Super admins can update admins"
  ON public.admins
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can delete admins" ON public.admins;
CREATE POLICY "Super admins can delete admins"
  ON public.admins
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

GRANT SELECT ON public.registrations TO authenticated;

DROP POLICY IF EXISTS "Active admins can read registrations" ON public.registrations;
CREATE POLICY "Active admins can read registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());
