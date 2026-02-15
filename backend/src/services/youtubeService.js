import axios from 'axios';

/**
 * YouTube Service - Searches and fetches video metadata using YouTube Data API v3
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const searchVideos = async (query, maxResults = 5) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults,
        videoDuration: 'medium', // 4-20 minutes
        order: 'relevance',
        safeSearch: 'strict',
      },
    });

    const videos = response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    return videos;
  } catch (err) {
    console.error('YouTube search error:', err.response?.data || err.message);
    throw new Error('Failed to search YouTube');
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        id: videoId,
        part: 'snippet,contentDetails,statistics',
      },
    });

    if (response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
    };
  } catch (err) {
    console.error('YouTube video details error:', err.response?.data || err.message);
    throw new Error('Failed to fetch video details');
  }
};

// Convert ISO 8601 duration to seconds
export const parseDuration = (isoDuration) => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  return hours * 3600 + minutes * 60 + seconds;
};
