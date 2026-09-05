-- ====================================================================
-- TOOLWALA — SUPABASE PRODUCTION DATABASE SCHEMA
-- Project Ref: qqxydjgyyohprbybhnqn
-- ====================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. USER CONVERSIONS & FILE ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Activity Policies (Users can only see and insert their own activity)
CREATE POLICY "Users can view own activity" 
  ON public.user_activity FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" 
  ON public.user_activity FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity" 
  ON public.user_activity FOR DELETE 
  USING (auth.uid() = user_id);

-- 3. SAVED PRESETS / EXAM BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.saved_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  preset_type TEXT NOT NULL, -- e.g. 'exam_spec', 'tool_settings'
  config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on saved_presets
ALTER TABLE public.saved_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own presets" 
  ON public.saved_presets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presets" 
  ON public.saved_presets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets" 
  ON public.saved_presets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets" 
  ON public.saved_presets FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. AUTOMATIC PROFILE CREATION TRIGGER
-- Automatically creates a row in public.profiles when a new user registers in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
