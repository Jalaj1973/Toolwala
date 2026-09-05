import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qqxydjgyyohprbybhnqn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 20
);

// Fallback mock client if anon key is not yet set
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Auth helper functions
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not fully configured yet. Please add your VITE_SUPABASE_ANON_KEY to .env'
    );
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not fully configured yet. Please add your VITE_SUPABASE_ANON_KEY to .env'
    );
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
}

export async function signInWithOAuth(provider) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not fully configured yet. Please add your VITE_SUPABASE_ANON_KEY to .env'
    );
  }
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) return { error: null };
  return await supabase.auth.signOut();
}

export async function getSession() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}
