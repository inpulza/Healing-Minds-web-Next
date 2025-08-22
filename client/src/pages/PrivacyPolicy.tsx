import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Privacy Policy - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
        : 'Política de Privacidad - Healing Minds Psychiatry | Dra. Melva Reve Naples FL',
      description: language === 'en'
        ? 'Privacy Policy for Healing Minds Psychiatry website. Learn how we collect, use, and protect your personal information in compliance with Florida and federal privacy laws.'
        : 'Política de Privacidad del sitio web de Healing Minds Psychiatry. Conozca cómo recopilamos, usamos y protegemos su información personal cumpliendo con las leyes de privacidad de Florida y federales.',
      keywords: language === 'en'
        ? 'privacy policy, data protection, personal information, FIPA compliance, psychiatry privacy, medical privacy'
        : 'política privacidad, protección datos, información personal, cumplimiento FIPA, privacidad psiquiátrica, privacidad médica',
      lang: language,
      canonical: language === 'en' ? '/privacy-policy' : '/es/politica-privacidad'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="privacy-policy-content">
            {language === 'en' ? (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Effective Date: [DATE TO BE PROVIDED]
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    Content for this privacy policy will be provided by the practice administrator.
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
                    El contenido de esta política de privacidad será proporcionado por el administrador de la práctica.
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

export default PrivacyPolicy;