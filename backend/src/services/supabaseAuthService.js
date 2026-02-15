import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign up with email/password
export const signUpWithEmail = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return data;
};

// Sign in with email/password
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
};

// Get current user
export const getCurrentUser = async (accessToken) => {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error) throw error;
  return data.user;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Verify JWT token
export const verifyToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return data.user;
};
