import prisma from '../utils/prisma.js';

// Mark module as complete
export const completeModule = async (req, res) => {
  try {
    const { id } = req.params; // module ID
    const userId = req.user.userId;

    // Get module details
    const module = await prisma.module.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Verify course ownership
    if (module.course.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if already completed
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId: id,
        },
      },
    });

    if (existingProgress?.completed) {
      return res.status(400).json({ error: 'Module already completed' });
    }

    // Mark as complete and award XP
    const progress = await prisma.progress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId: id,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
        xpEarned: module.xpReward,
      },
      create: {
        userId,
        moduleId: id,
        completed: true,
        completedAt: new Date(),
        xpEarned: module.xpReward,
      },
    });

    // Update module status
    await prisma.module.update({
      where: { id },
      data: { status: 'completed' },
    });

    // Update user stats
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (stats) {
      const newTotalXp = stats.totalXp + module.xpReward;
      const newLevel = Math.floor(newTotalXp / 500) + 1; // Level up every 500 XP

      // Check streak
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = stats.lastActivityDate?.toISOString().split('T')[0];
      const isConsecutive = lastActivity === new Date(Date.now() - 86400000).toISOString().split('T')[0];

      await prisma.userStats.update({
        where: { userId },
        data: {
          totalXp: newTotalXp,
          level: newLevel,
          modulesCompleted: stats.modulesCompleted + 1,
          streakDays: isConsecutive ? stats.streakDays + 1 : 1,
          lastActivityDate: new Date(),
        },
      });
    }

    // Unlock next module
    const nextModule = await prisma.module.findFirst({
      where: {
        courseId: module.courseId,
        orderIndex: module.orderIndex + 1,
      },
    });

    if (nextModule && nextModule.status === 'locked') {
      await prisma.module.update({
        where: { id: nextModule.id },
        data: { status: 'active' },
      });
    }

    res.json({
      message: 'Module completed!',
      progress,
      xpEarned: module.xpReward,
    });
  } catch (err) {
    console.error('Complete module error:', err);
    res.status(500).json({ error: 'Failed to complete module' });
  }
};

// Get user progress summary
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const progress = await prisma.progress.findMany({
      where: { userId, completed: true },
      include: {
        module: {
          select: {
            title: true,
            courseId: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    res.json({
      progress,
      stats,
    });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

// Get user stats
export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    res.json({ stats });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
