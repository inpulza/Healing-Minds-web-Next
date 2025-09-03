import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokVideos } from '@/hooks/useTikTokVideos';
import { Play } from 'lucide-react';

const CompactVideoCarousel = () => {
  const { language } = useLanguage();
  const { data: tikTokVideos, isLoading: isLoadingVideos } = useTikTokVideos();

  return (
    <div className="mt-8 pt-8 border-t border-green-200">
      {/* Grid de Videos Compacto */}
      {isLoadingVideos ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-green-100 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-green-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {tikTokVideos?.slice(0, 4).map((video: any, index: number) => (
            <div key={video.id} className="group">
              <a 
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-100 rounded-xl overflow-hidden hover:bg-green-200 transition-all duration-300"
                data-testid={`compact-video-link-${index + 1}`}
              >
                <div className="aspect-square relative overflow-hidden">
                  {video.thumbnail ? (
                    <>
                      <img 
                        src={video.thumbnail}
                        alt={`Video: ${video.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-4 h-4 text-gray-800 ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center h-full">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 text-green-600 ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* CTA compacto para TikTok */}
      <div className="text-center">
        <p className="text-gray-600 mb-4 text-sm">
          {language === 'en'
            ? 'Have a question for Dr. Reve? Follow me on TikTok for daily mental health tips.'
            : '¿Tienes una pregunta para la Dra. Reve? Sígueme en TikTok para consejos diarios de salud mental.'
          }
        </p>
        <a
          href="https://www.tiktok.com/@dra.melvavidal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors duration-300"
          data-testid="compact-tiktok-follow-button"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1.183-.11 6.44 6.44 0 0 0-6.444 6.444 6.44 6.44 0 0 0 6.444 6.444 6.44 6.44 0 0 0 6.444-6.444V8.862a8.23 8.23 0 0 0 4.789 1.515v-3.446a4.792 4.792 0 0 1-.817-.245z"/>
          </svg>
          <span>
            {language === 'en' ? 'Follow @dra.melvavidal' : 'Seguir @dra.melvavidal'}
          </span>
        </a>
      </div>
    </div>
  );
};

export default CompactVideoCarousel;