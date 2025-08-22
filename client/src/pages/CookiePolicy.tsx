import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const CookiePolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Cookie Policy - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
        : 'Política de Cookies - Healing Minds Psychiatry | Dra. Melva Reve Naples FL',
      description: language === 'en'
        ? 'Cookie Policy for Healing Minds Psychiatry website. Learn about the cookies and tracking technologies we use to improve your browsing experience.'
        : 'Política de Cookies del sitio web de Healing Minds Psychiatry. Conozca sobre las cookies y tecnologías de seguimiento que usamos para mejorar su experiencia de navegación.',
      keywords: language === 'en'
        ? 'cookie policy, tracking technologies, web analytics, website cookies, privacy preferences'
        : 'política cookies, tecnologías seguimiento, análisis web, cookies sitio web, preferencias privacidad',
      lang: language,
      canonical: language === 'en' ? '/cookie-policy' : '/es/politica-cookies'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Cookie Policy' : 'Política de Cookies'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="cookie-policy-content">
            {language === 'en' ? (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Effective Date: [DATE TO BE PROVIDED]
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                  <p className="text-orange-800 dark:text-orange-300 text-center font-medium">
                    Cookie policies are required by law in 2024 for websites that use tracking technologies.
                    Content will be provided to ensure compliance with current privacy regulations.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    Content for this cookie policy will be provided by the practice administrator.
                    This page has been optimized for search engines and is ready to receive the legal content.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Fecha de Vigencia: [FECHA A SER PROPORCIONADA]
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                  <p className="text-orange-800 dark:text-orange-300 text-center font-medium">
                    Las políticas de cookies son requeridas por ley en 2024 para sitios web que usan tecnologías de seguimiento.
                    El contenido será proporcionado para asegurar el cumplimiento con las regulaciones de privacidad actuales.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    El contenido de esta política de cookies será proporcionado por el administrador de la práctica.
                    Esta página ha sido optimizada para motores de búsqueda y está lista para recibir el contenido legal.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;