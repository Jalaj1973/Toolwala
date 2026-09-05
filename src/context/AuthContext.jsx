import { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  isConfigured,
  signInWithEmail,
  signUpWithEmail,
  signInWithOAuth,
  resetPasswordForEmail,
  signOut,
  fetchProfile,
} from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Supabase profiles table
  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const prof = await fetchProfile(userId);
    setProfile(prof);
  };

  useEffect(() => {
    let subscription = null;

    if (isConfigured) {
      // 1. Fetch initial session from Supabase
      supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          loadProfile(initialSession.user.id);
        }
        setLoading(false);
      });

      // 2. Subscribe to auth changes (sign in, sign out, token refreshed, email confirmed)
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      subscription = data?.subscription;
    } else {
      setLoading(false);
    }

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmail(email, password);
    if (res.data?.user) {
      setUser(res.data.user);
      setSession(res.data.session);
      await loadProfile(res.data.user.id);
    }
    return res;
  };

  const register = async (email, password, fullName) => {
    return await signUpWithEmail(email, password, fullName);
  };

  const loginOAuth = async (provider) => {
    return await signInWithOAuth(provider);
  };

  const sendPasswordReset = async (email) => {
    return await resetPasswordForEmail(email);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        login,
        register,
        loginOAuth,
        sendPasswordReset,
        logout,
        refreshProfile: () => user && loadProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
