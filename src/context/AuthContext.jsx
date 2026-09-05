import { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  signInWithEmail as sbSignIn,
  signUpWithEmail as sbSignUp,
  signInWithOAuth as sbOAuth,
  signOut as sbSignOut,
} from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription = null;

    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });
      subscription = data?.subscription;
    } else {
      // Check for local demo session if Supabase anon key not yet configured
      const demoUser = localStorage.getItem('toolwala_demo_user');
      if (demoUser) {
        try {
          setUser(JSON.parse(demoUser));
        } catch {
          // ignore error
        }
      }
      setLoading(false);
    }

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    if (isSupabaseConfigured) {
      return await sbSignIn(email, password);
    }
    // Demo fallback login
    const demo = {
      id: 'demo-user-123',
      email,
      user_metadata: { full_name: email.split('@')[0] },
      isDemo: true,
    };
    localStorage.setItem('toolwala_demo_user', JSON.stringify(demo));
    setUser(demo);
    return { data: { user: demo }, error: null };
  };

  const registerWithEmail = async (email, password) => {
    if (isSupabaseConfigured) {
      return await sbSignUp(email, password);
    }
    // Demo fallback register
    const demo = {
      id: 'demo-user-' + Date.now(),
      email,
      user_metadata: { full_name: email.split('@')[0] },
      isDemo: true,
    };
    localStorage.setItem('toolwala_demo_user', JSON.stringify(demo));
    setUser(demo);
    return { data: { user: demo }, error: null };
  };

  const loginWithOAuth = async (provider) => {
    if (isSupabaseConfigured) {
      return await sbOAuth(provider);
    }
    // Demo fallback OAuth
    const demo = {
      id: `demo-${provider}-user`,
      email: `user@${provider}.demo`,
      user_metadata: { full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` },
      isDemo: true,
    };
    localStorage.setItem('toolwala_demo_user', JSON.stringify(demo));
    setUser(demo);
    return { data: { user: demo }, error: null };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await sbSignOut();
    }
    localStorage.removeItem('toolwala_demo_user');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginWithOAuth,
        logout,
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
