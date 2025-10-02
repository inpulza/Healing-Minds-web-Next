import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';

const FloatingVideoBubble = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserClosed, setHasUserClosed] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const closedState = localStorage.getItem('videoBubbleClosed');
    if (closedState === 'true') {
      setHasUserClosed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setHasUserClosed(true);
    localStorage.setItem('videoBubbleClosed', 'true');
  };

  const handleBubbleClick = () => {
    setIsExpanded(true);
    setIsMuted(false);
  };

  const handleDialogClose = () => {
    setIsExpanded(false);
    setIsMuted(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBubbleClick();
    }
  };

  if (hasUserClosed) return null;

  const videoId = 'AnkrRvsjFIE';

  return (
    <>
      <AnimatePresence>
        {isVisible && !isExpanded && (
          <motion.div
            ref={bubbleRef}
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 0.4 
            }}
            className="fixed bottom-20 right-6 z-[9998] lg:bottom-8 lg:right-8"
            style={{
              marginBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
            data-testid="floating-video-bubble"
          >
            <div className="relative group">
              <button
                onClick={handleClose}
                className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                aria-label={language === 'es' ? 'Cerrar video' : 'Close video'}
                data-testid="button-close-bubble"
              >
                <X className="w-3 h-3" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBubbleClick}
                onKeyDown={handleKeyDown}
                className="relative w-24 h-44 lg:w-28 lg:h-52 rounded-2xl overflow-hidden cursor-pointer shadow-2xl border-4 border-white dark:border-gray-800 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 transition-all"
                aria-label={language === 'es' ? 'Reproducir video de presentación' : 'Play introduction video'}
                data-testid="button-expand-video"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-700/10 group-hover:from-green-500/20 group-hover:to-green-700/20 transition-all duration-300" />
                
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  allow="autoplay; encrypted-media"
                  style={{ 
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                  title={language === 'es' ? 'Video de presentación' : 'Introduction video'}
                  tabIndex={-1}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300 pointer-events-none">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="bg-white/90 rounded-full p-2.5 shadow-lg"
                  >
                    <Play className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 ml-0.5" fill="currentColor" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3"
                  >
                    <span className="text-[10px] lg:text-xs font-medium text-white bg-black/60 px-2 py-1 rounded-full shadow-md whitespace-nowrap">
                      {language === 'es' ? '¡Haz clic para ver!' : 'Click to watch!'}
                    </span>
                  </motion.div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isExpanded} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-lg p-0 overflow-hidden bg-black border-none"
          aria-describedby="video-description"
        >
          <DialogTitle className="sr-only">
            {language === 'es' 
              ? 'Video de presentación de la Dra. Melva Reve' 
              : 'Dr. Melva Reve Introduction Video'}
          </DialogTitle>

          <div className="relative w-full aspect-[9/16] max-h-[85vh]">
            <span id="video-description" className="sr-only">
              {language === 'es' 
                ? 'Video de presentación de la Dra. Melva Reve donde habla sobre sus servicios' 
                : 'Introduction video from Dr. Melva Reve talking about her services'}
            </span>
            
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={language === 'es' 
                ? 'Video de presentación de la Dra. Melva Reve' 
                : 'Introduction video from Dr. Melva Reve'}
            />

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={isMuted 
                ? (language === 'es' ? 'Activar sonido' : 'Unmute') 
                : (language === 'es' ? 'Silenciar' : 'Mute')}
              data-testid="button-toggle-mute"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingVideoBubble;
