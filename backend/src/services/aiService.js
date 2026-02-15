import axios from 'axios';

/**
 * AI Service - Generates personalized learning courses
 */

export const generateCourse = async (profile) => {
  const prompt = `You are an expert learning architect. Generate a personalized learning course based on the following user profile:

Goal: ${profile.goal}
Timeframe: ${profile.timeframeWeeks} weeks
Weekly Hours: ${profile.weeklyHours} hours/week
Skill Level: ${profile.skillLevel}
Learning Style: ${profile.learningStyle}
End Objective: ${profile.endObjective}
Prior Knowledge: ${profile.priorKnowledge || 'None specified'}

Generate a structured learning course that:
1. Breaks the goal into logical milestones (3-5 major phases)
2. Each milestone contains 2-4 modules
3. Each module has a clear title, description, estimated hours, and week number
4. Total course fits within the timeframe and weekly availability
5. Adapts to the user's skill level (beginner = more fundamentals)
6. Each module includes a search query for finding relevant YouTube videos

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "title": "Course Title",
  "description": "Brief course overview",
  "estimatedWeeks": 12,
  "milestones": [
    {
      "title": "Milestone 1",
      "modules": [
        {
          "title": "Module Title",
          "description": "What this module covers",
          "weekNumber": 1,
          "estimatedHours": 8,
          "learningObjectives": ["objective 1", "objective 2"],
          "youtubeSearchQuery": "specific search query for finding relevant video"
        }
      ]
    }
  ]
}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a world-class learning architect. Output only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    
    // Clean up markdown code blocks if present
    let cleanedContent = content;
    if (content.startsWith('```json')) {
      cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (content.startsWith('```')) {
      cleanedContent = content.replace(/```\n?/g, '');
    }

    const courseData = JSON.parse(cleanedContent);
    return courseData;
  } catch (err) {
    console.error('AI Service Error:', err.response?.data || err.message);
    throw new Error('Failed to generate course with AI');
  }
};
