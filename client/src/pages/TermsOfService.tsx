import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const TermsOfService = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Terms of Service - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
        : 'Términos de Servicio - Healing Minds Psychiatry | Dra. Melva Reve Naples FL',
      description: language === 'en'
        ? 'Terms of Service for Healing Minds Psychiatry website. Understand the rules and conditions for using our psychiatric services and website in Naples, FL.'
        : 'Términos de Servicio del sitio web de Healing Minds Psychiatry. Comprenda las reglas y condiciones para usar nuestros servicios psiquiátricos y sitio web en Naples, FL.',
      keywords: language === 'en'
        ? 'terms of service, website terms, psychiatric services terms, medical terms, Naples psychiatry'
        : 'términos servicio, términos sitio web, términos servicios psiquiátricos, términos médicos, psiquiatría Naples',
      lang: language,
      canonical: language === 'en' ? '/terms-of-service' : '/es/terminos-servicio'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="terms-of-service-content">
            {language === 'en' ? (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Effective Date: [DATE TO BE PROVIDED]
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    Content for these terms of service will be provided by the practice administrator.
                    This page has been optimized for search engines and is ready to receive the legal content.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Fecha de Vigencia: [FECHA A SER PROPORCIONADA]
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    El contenido de estos términos de servicio será proporcionado por el administrador de la práctica.
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

export default TermsOfService;