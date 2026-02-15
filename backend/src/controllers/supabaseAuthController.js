import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, verifyToken } from '../services/supabaseAuthService.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register new user with Supabase
export const register = async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    // Create user in Supabase Auth
    const { user, session } = await signUpWithEmail(email, password, name || email);

    // Create user profile in our database
    const dbUser = await prisma.user.create({
      data: {
        id: user.id, // Use Supabase user ID
        email: user.email,
        passwordHash: 'supabase-managed', // Password managed by Supabase
        name: name || user.user_metadata?.name || null,
        stats: {
          create: {
            totalXp: 0,
            level: 1,
            streakDays: 0,
            modulesCompleted: 0,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: dbUser,
      token: session.access_token,
      refreshToken: session.refresh_token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
};

// Login user with Supabase
export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Sign in with Supabase
    const { user, session } = await signInWithEmail(email, password);

    // Get user from our database
    let dbUser = await prisma.user.findUnique({ 
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    // If user doesn't exist in our DB (OAuth user), create them
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          passwordHash: 'supabase-managed',
          name: user.user_metadata?.name || null,
          stats: {
            create: {
              totalXp: 0,
              level: 1,
              streakDays: 0,
              modulesCompleted: 0,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.json({
      message: 'Login successful',
      user: dbUser,
      token: session.access_token,
      refreshToken: session.refresh_token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('Login error:', err);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Google OAuth login URL
export const googleLogin = async (req, res) => {
  try {
    const { url } = await signInWithGoogle();
    res.json({ url });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Failed to initiate Google login' });
  }
};

// Handle OAuth callback
export const handleCallback = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token required' });
    }

    // Verify token and get user
    const user = await verifyToken(access_token);

    // Get or create user in our database
    let dbUser = await prisma.user.findUnique({ 
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          passwordHash: 'supabase-managed',
          name: user.user_metadata?.name || user.user_metadata?.full_name || null,
          stats: {
            create: {
              totalXp: 0,
              level: 1,
              streakDays: 0,
              modulesCompleted: 0,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }

    res.json({
      message: 'Authentication successful',
      user: dbUser,
      token: access_token,
    });
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Get current user (using Supabase token)
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        lastLogin: true,
        profile: true,
        stats: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
