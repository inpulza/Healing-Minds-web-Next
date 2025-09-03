import { useQuery } from '@tanstack/react-query';

interface TikTokVideo {
  id: string;
  text: string;
  mediaUrls: string[];
  link: string;
  commentCount: number;
  reactionCount: number | null;
}

interface TikTokAPIResponse {
  success: boolean;
  data: {
    data: Array<{
      root: {
        element: TikTokVideo;
      };
    }>;
  };
}

// Specific video IDs we want to display (in order)
const targetVideoIds = [
  '7545182480849014029',
  '7543698359270329655', 
  '7542966062690700558',
  '7541842758235901239'
];

export function useTikTokVideos() {
  return useQuery({
    queryKey: ['/api/tiktok'],
    select: (data: TikTokAPIResponse) => {
      const allVideos = data?.data?.data?.map(item => {
        const video = item.root.element;
        return {
          id: video.id,
          title: video.text.split('\n')[0]?.replace(/[💔🧠❤️🎯✨💡🌟]/g, '').trim() || 'Video de la Dra. Reve',
          description: video.text.substring(0, 100) + '...',
          thumbnail: video.mediaUrls[0] || '',
          url: video.link,
          commentCount: video.commentCount,
          reactionCount: video.reactionCount || 0
        };
      }) || [];

      // Filter and order videos by our target list
      const orderedVideos = targetVideoIds.map((targetId, index) => {
        const foundVideo = allVideos.find(video => video.id === targetId);
        if (foundVideo) {
          return { ...foundVideo, displayIndex: index };
        }
        // Fallback for videos not found in API
        return {
          id: `fallback-${targetId}`,
          title: 'Video de la Dra. Reve',
          description: 'Contenido educativo sobre salud mental...',
          thumbnail: '',
          url: `https://www.tiktok.com/@dra.melvavidal/video/${targetId}`,
          commentCount: 0,
          reactionCount: 0,
          displayIndex: index
        };
      });

      return orderedVideos;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}