import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Home } from 'lucide-react';

const ThankYou = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Thank You - Healing Minds Psychiatry'
        : 'Gracias - Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Thank you for contacting Healing Minds Psychiatry. We will get back to you within 24 hours.'
        : 'Gracias por contactar a Healing Minds Psychiatry. Le responderemos dentro de 24 horas.',
      keywords: language === 'en'
        ? 'thank you, contact confirmation, psychiatry Naples'
        : 'gracias, confirmación contacto, psiquiatría Naples',
      lang: language,
      canonical: language === 'en' ? '/thank-you' : '/es/gracias'
    };
    updateSEO(seoData);
  }, [language]);

  const videoId = 'AnkrRvsjFIE';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-body text-gray-900 mb-4" data-testid="thank-you-title">
              {language === 'en' ? (
                <>
                  Thank you for <span className="font-display italic text-green-700">reaching out</span>
                </>
              ) : (
                <>
                  Gracias por <span className="font-display italic text-green-700">contactarnos</span>
                </>
              )}
            </h3>
            <p className="text-base font-body text-gray-600 max-w-2xl mx-auto" data-testid="thank-you-message">
              {language === 'en' 
                ? 'We received your message and will get back to you within 24 hours.'
                : 'Recibimos su mensaje y le responderemos dentro de 24 horas.'
              }
            </p>
          </div>

          <div className="mb-12">
            <div className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg" data-testid="thank-you-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                title={language === 'en' ? 'Meet Dr. Melva Reve' : 'Conoce a la Dra. Melva Reve'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            </div>
          </div>

          <div className="text-center">
            <Link href={language === 'en' ? '/' : '/es'}>
              <Button 
                size="lg" 
                className="font-body bg-green-700 hover:bg-green-800 text-white"
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Go to Home' : 'Ir al Inicio'}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
