import prisma from '../utils/prisma.js';
import { generateCourse } from '../services/aiService.js';
import { searchVideos, parseDuration } from '../services/youtubeService.js';

// Generate a new course from user profile
export const createCourse = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(400).json({ error: 'Please complete onboarding first' });
    }

    // Generate course with AI
    console.log('🤖 Generating course with AI...');
    const aiCourse = await generateCourse(profile);

    // Create course in database
    const course = await prisma.course.create({
      data: {
        userId,
        title: aiCourse.title,
        description: aiCourse.description,
        estimatedWeeks: aiCourse.estimatedWeeks,
        totalModules: aiCourse.milestones.reduce((acc, m) => acc + m.modules.length, 0),
        status: 'active',
      },
    });

    // Create modules with YouTube resources
    let orderIndex = 0;
    for (const milestone of aiCourse.milestones) {
      for (const moduleData of milestone.modules) {
        orderIndex++;

        const module = await prisma.module.create({
          data: {
            courseId: course.id,
            orderIndex,
            title: moduleData.title,
            description: moduleData.description,
            weekNumber: moduleData.weekNumber,
            estimatedHours: moduleData.estimatedHours,
            status: orderIndex === 1 ? 'active' : 'locked',
            xpReward: 100,
          },
        });

        // Search YouTube for relevant video
        if (moduleData.youtubeSearchQuery) {
          try {
            console.log(`🔍 Searching YouTube: "${moduleData.youtubeSearchQuery}"`);
            const videos = await searchVideos(moduleData.youtubeSearchQuery, 3);

            if (videos.length > 0) {
              const topVideo = videos[0];

              // Create resource
              await prisma.resource.create({
                data: {
                  moduleId: module.id,
                  type: 'video',
                  title: topVideo.title,
                  youtubeVideoId: topVideo.videoId,
                  durationSeconds: 0, // Can be enhanced with video details API
                  orderIndex: 1,
                },
              });

              console.log(`✅ Added video: ${topVideo.title}`);
            }
          } catch (err) {
            console.error(`⚠️ Failed to fetch video for module ${module.title}:`, err.message);
          }
        }
      }
    }

    // Fetch complete course with modules
    const completeCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        modules: {
          include: {
            resources: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.status(201).json({
      message: 'Course generated successfully',
      course: completeCourse,
    });
  } catch (err) {
    console.error('Course generation error:', err);
    res.status(500).json({
      error: 'Failed to generate course',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// Get all user courses
export const getCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const courses = await prisma.course.findMany({
      where: { userId },
      include: {
        modules: {
          select: {
            id: true,
            title: true,
            status: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ courses });
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get single course with modules
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const course = await prisma.course.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        modules: {
          include: {
            resources: true,
            progress: {
              where: { userId },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};
