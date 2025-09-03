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

// Specific video IDs we want to display (in order of preference)
const targetVideoIds = [
  '7545182480849014029',  // Vence la Parálisis por Desorden
  '7543698359270329655',  // Guía Rápida para Calmar un Ataque de Pánico
  '7544069344217582903',  // TDAH en Pareja (replacement for missing video)
  '7543327515486506253'   // ¿El Rechazo te Duele Físicamente? DSR (replacement for missing video)
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

      // If we found fewer than expected, also include some available videos
      const foundVideosCount = orderedVideos.filter(v => !v.id.startsWith('fallback-')).length;
      if (foundVideosCount < 4 && allVideos.length > 0) {
        // Add any available videos that we don't have yet
        const missingSlots = 4 - foundVideosCount;
        const additionalVideos = allVideos
          .filter(video => !orderedVideos.some(ov => ov.id === video.id))
          .slice(0, missingSlots)
          .map((video, index) => ({ ...video, displayIndex: foundVideosCount + index }));
        
        // Replace fallback videos with real ones
        additionalVideos.forEach(realVideo => {
          const fallbackIndex = orderedVideos.findIndex(v => v.id.startsWith('fallback-'));
          if (fallbackIndex !== -1) {
            orderedVideos[fallbackIndex] = realVideo;
          }
        });
      }

      return orderedVideos;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}