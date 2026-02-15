/**
 * Mock AI Service - Generates demo courses for testing
 * Use this when OpenAI API is unavailable
 */

export const generateMockCourse = (profile) => {
  return {
    title: `${profile.goal} - Complete Course`,
    description: `A personalized ${profile.timeframeWeeks}-week journey to master ${profile.goal.toLowerCase()}, tailored for ${profile.skillLevel} learners.`,
    estimatedWeeks: profile.timeframeWeeks,
    milestones: [
      {
        title: "Foundations & Fundamentals",
        modules: [
          {
            title: "Introduction to the Basics",
            description: `Start your ${profile.goal.toLowerCase()} journey with core concepts and fundamental principles.`,
            weekNumber: 1,
            estimatedHours: Math.floor(profile.weeklyHours * 0.8),
            learningObjectives: [
              "Understand key terminology and concepts",
              "Set up your development environment",
              "Complete your first hands-on exercise"
            ],
            youtubeSearchQuery: `${profile.goal} tutorial for beginners 2024`
          },
          {
            title: "Core Concepts Deep Dive",
            description: "Explore essential concepts that form the foundation of your learning path.",
            weekNumber: 2,
            estimatedHours: profile.weeklyHours,
            learningObjectives: [
              "Master fundamental concepts",
              "Apply knowledge through practical examples",
              "Build confidence with guided exercises"
            ],
            youtubeSearchQuery: `${profile.goal} core concepts explained`
          }
        ]
      },
      {
        title: "Intermediate Skills",
        modules: [
          {
            title: "Building Your First Project",
            description: "Apply what you've learned by creating a real-world project from scratch.",
            weekNumber: 4,
            estimatedHours: profile.weeklyHours * 1.2,
            learningObjectives: [
              "Plan and structure a project",
              "Implement core functionality",
              "Debug and test your work"
            ],
            youtubeSearchQuery: `${profile.goal} project tutorial step by step`
          },
          {
            title: "Advanced Techniques",
            description: "Level up your skills with intermediate-to-advanced techniques and best practices.",
            weekNumber: 6,
            estimatedHours: profile.weeklyHours,
            learningObjectives: [
              "Learn industry best practices",
              "Optimize your workflow",
              "Handle complex scenarios"
            ],
            youtubeSearchQuery: `${profile.goal} advanced techniques 2024`
          }
        ]
      },
      {
        title: "Mastery & Real-World Application",
        modules: [
          {
            title: "Final Project: " + profile.endObjective,
            description: `Build ${profile.endObjective.toLowerCase()} - putting everything together.`,
            weekNumber: Math.floor(profile.timeframeWeeks * 0.75),
            estimatedHours: profile.weeklyHours * 1.5,
            learningObjectives: [
              "Design and implement a complete solution",
              "Apply all learned concepts",
              "Prepare for deployment"
            ],
            youtubeSearchQuery: `${profile.goal} complete project build`
          },
          {
            title: "Deployment & Best Practices",
            description: "Learn how to deploy, maintain, and scale your work in production.",
            weekNumber: profile.timeframeWeeks - 1,
            estimatedHours: profile.weeklyHours,
            learningObjectives: [
              "Deploy to production",
              "Implement monitoring and logging",
              "Plan for future growth"
            ],
            youtubeSearchQuery: `${profile.goal} deployment tutorial`
          }
        ]
      }
    ]
  };
};
