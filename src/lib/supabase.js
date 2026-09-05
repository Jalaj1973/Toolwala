import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://qqxydjgyyohprbybhnqn.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_rRs9AZBQy1N1qaacujDZyw_YiE2cbeX';

export const isConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim() !== ''
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createClient(supabaseUrl, 'placeholder-key-for-init', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
  if (!isConfigured) {
    throw new Error('Supabase anon key is missing. Please set VITE_SUPABASE_ANON_KEY in your .env file.');
  }
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign up a new user with email, password, and full name metadata
 * Triggers confirmation email from Supabase
 */
export async function signUpWithEmail(email, password, fullName) {
  if (!isConfigured) {
    throw new Error('Supabase anon key is missing. Please set VITE_SUPABASE_ANON_KEY in your .env file.');
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
}

/**
 * Sign in with Google or GitHub OAuth
 */
export async function signInWithOAuth(provider) {
  if (!isConfigured) {
    throw new Error('Supabase anon key is missing. Please set VITE_SUPABASE_ANON_KEY in your .env file.');
  }
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
}

/**
 * Send password reset email
 */
export async function resetPasswordForEmail(email) {
  if (!isConfigured) {
    throw new Error('Supabase anon key is missing. Please set VITE_SUPABASE_ANON_KEY in your .env file.');
  }
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!isConfigured) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * Fetch profile data from public.profiles table
 */
export async function fetchProfile(userId) {
  if (!isConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('Profile fetch note:', error.message);
    return null;
  }
  return data;
}
