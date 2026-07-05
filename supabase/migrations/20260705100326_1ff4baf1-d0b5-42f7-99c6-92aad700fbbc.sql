
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  designation TEXT NOT NULL CHECK (char_length(trim(designation)) BETWEEN 2 AND 120),
  organization TEXT NOT NULL CHECK (char_length(trim(organization)) BETWEEN 2 AND 160),
  country_code TEXT NOT NULL CHECK (country_code ~ '^\+[1-9][0-9]{0,3}$'),
  whatsapp TEXT NOT NULL CHECK (whatsapp ~ '^[0-9\s().-]{6,20}$'),
  email CITEXT NOT NULL CHECK (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  gender TEXT NOT NULL CHECK (
    gender IN ('Female', 'Male', 'Nonbinary', 'Prefer not to say')
  )
);

CREATE UNIQUE INDEX registrations_email_unique
  ON public.registrations (lower(email::text));

CREATE UNIQUE INDEX registrations_phone_unique
  ON public.registrations (country_code, regexp_replace(whatsapp, '\D', '', 'g'));

CREATE INDEX registrations_created_at_idx
  ON public.registrations (created_at DESC);

REVOKE ALL ON public.registrations FROM anon, authenticated;
GRANT INSERT ON public.registrations TO anon;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous registration insert"
  ON public.registrations
  FOR INSERT
  TO anon
  WITH CHECK (
    char_length(trim(name)) BETWEEN 2 AND 120
    AND char_length(trim(designation)) BETWEEN 2 AND 120
    AND char_length(trim(organization)) BETWEEN 2 AND 160
    AND country_code ~ '^\+[1-9][0-9]{0,3}$'
    AND whatsapp ~ '^[0-9\s().-]{6,20}$'
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    AND gender IN ('Female', 'Male', 'Nonbinary', 'Prefer not to say')
  );
