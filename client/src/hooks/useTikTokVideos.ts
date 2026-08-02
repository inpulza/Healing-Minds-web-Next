import { useQuery } from '@tanstack/react-query';
import { socialProfiles } from '@shared/social-profiles';

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
  '7542966062690700558',  // Cerebro de Carreras, Frenos de Bicicleta (video original solicitado)
  '7543327515486506253'   // ¿El Rechazo te Duele Físicamente? DSR
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
      const uniqueVideos = [...new Map(allVideos.map(video => [video.id, video])).values()];

      // Filter and order videos by our target list
      const orderedVideos = targetVideoIds.map((targetId, index) => {
        const foundVideo = uniqueVideos.find(video => video.id === targetId);
        
        if (foundVideo) {
          return { ...foundVideo, displayIndex: index };
        }
        // Fallback for videos not found in API
        return {
          id: `fallback-${targetId}`,
          title: 'Video de la Dra. Reve',
          description: 'Contenido educativo sobre salud mental...',
          thumbnail: '',
          url: `${socialProfiles.tiktok.url}/video/${targetId}`,
          commentCount: 0,
          reactionCount: 0,
          displayIndex: index
        };
      });

      // If we found fewer than expected, also include some available videos
      const foundVideosCount = orderedVideos.filter(v => !v.id.startsWith('fallback-')).length;
      if (foundVideosCount < 4 && uniqueVideos.length > 0) {
        // Get all real video IDs that are already used
        const usedVideoIds = new Set(orderedVideos
          .filter(v => !v.id.startsWith('fallback-'))
          .map(v => v.id)
        );
        
        // Find available videos that haven't been used yet
        const availableVideos = uniqueVideos.filter(video => !usedVideoIds.has(video.id));
        
        // Replace fallback videos with unique real ones
        const fallbackIndices = orderedVideos
          .map((video, index) => video.id.startsWith('fallback-') ? index : -1)
          .filter(index => index !== -1);
        
        const missingSlots = Math.min(fallbackIndices.length, availableVideos.length);
        
        for (let i = 0; i < missingSlots; i++) {
          const fallbackIndex = fallbackIndices[i];
          const replacementVideo = availableVideos[i];
          
          orderedVideos[fallbackIndex] = {
            ...replacementVideo,
            displayIndex: fallbackIndex
          };
        }
      }

      // Final validation: ensure all keys are absolutely unique
      const seenIds = new Set();
      const finalVideos = orderedVideos.map((video, index) => {
        let uniqueId = video.id;
        let counter = 0;
        
        // If we've seen this ID before, make it unique
        while (seenIds.has(uniqueId)) {
          counter++;
          uniqueId = `${video.id}-${counter}`;
        }
        
        seenIds.add(uniqueId);
        
        return {
          ...video,
          id: uniqueId
        };
      });

      return finalVideos;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
