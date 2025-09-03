import { Play } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokVideos } from '@/hooks/useTikTokVideos';

const CompactVideoCarousel = () => {
  const { language } = useLanguage();
  const { data: tikTokVideos, isLoading: isLoadingVideos } = useTikTokVideos();

  return (
    <section className="pt-0 pb-12 sm:pb-16 lg:pb-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        {/* Encabezado compacto */}
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-body font-bold text-green-800 mb-3">
            {language === 'en' 
              ? <>Daily <span className="font-display italic text-green-700">Mental Health</span> Tips</>
              : <>Consejos <span className="font-display italic text-green-700">Diarios</span> de Salud Mental</>
            }
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto font-body">
            {language === 'en'
              ? 'Follow Dr. Reve for practical insights and guidance on your wellness journey.'
              : 'Sigue a la Dra. Reve para obtener consejos prácticos y orientación en tu camino al bienestar.'
            }
          </p>
        </div>

        {/* Carrusel compacto de videos - MUCHO MÁS PEQUEÑO */}
        {isLoadingVideos ? (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-2">
                  <div className="h-3 bg-gray-200 rounded mb-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
            {tikTokVideos?.slice(0, 4).map((video, index) => (
              <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300 group">
                <a 
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid={`compact-video-link-${index + 1}`}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {video.thumbnail ? (
                      <>
                        <img 
                          src={video.thumbnail}
                          alt={`Video: ${video.title}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-6 h-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-3 h-3 text-gray-800 ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center h-full">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-3 h-3 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight" data-testid={`compact-video-title-${index + 1}`}>
                      {video.title.length > 30 ? `${video.title.substring(0, 30)}...` : video.title}
                    </h4>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* CTA compacto para TikTok */}
        <div className="text-center">
          <a
            href="https://www.tiktok.com/@dra.melvavidal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300"
            data-testid="compact-tiktok-follow-button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1.183-.11 6.44 6.44 0 0 0-6.444 6.444 6.44 6.44 0 0 0 6.444 6.444 6.44 6.44 0 0 0 6.444-6.444V8.862a8.23 8.23 0 0 0 4.789 1.515v-3.446a4.792 4.792 0 0 1-.817-.245z"/>
            </svg>
            <span>
              {language === 'en' ? 'Follow @dra.melvavidal' : 'Seguir @dra.melvavidal'}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CompactVideoCarousel;