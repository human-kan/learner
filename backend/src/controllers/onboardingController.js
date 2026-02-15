import { z } from 'zod';
import prisma from '../utils/prisma.js';

// Validation schema for onboarding
const onboardingSchema = z.object({
  goal: z.string().min(5, 'Goal must be at least 5 characters'),
  timeframeWeeks: z.number().int().min(1).max(52),
  weeklyHours: z.number().int().min(1).max(168),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  learningStyle: z.enum(['visual', 'text', 'practical', 'mixed']),
  endObjective: z.string().min(10, 'End objective must be at least 10 characters'),
  priorKnowledge: z.string().optional(),
});

// Submit onboarding profile
export const submitOnboarding = async (req, res) => {
  try {
    const data = onboardingSchema.parse(req.body);
    const userId = req.user.userId;

    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.userProfile.update({
        where: { userId },
        data,
      });
    } else {
      // Create new profile
      profile = await prisma.userProfile.create({
        data: {
          ...data,
          userId,
        },
      });
    }

    res.status(201).json({
      message: 'Onboarding profile saved successfully',
      profile,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Failed to save onboarding profile' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
