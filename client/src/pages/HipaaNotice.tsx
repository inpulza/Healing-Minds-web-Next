import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const HipaaNotice = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'HIPAA Notice of Privacy Practices - Healing Minds Psychiatry | Dr. Melva Reve'
        : 'Aviso de Prácticas de Privacidad HIPAA - Healing Minds Psychiatry | Dra. Melva Reve',
      description: language === 'en'
        ? 'HIPAA Notice of Privacy Practices for Healing Minds Psychiatry patients. Learn how your protected health information is used and protected under federal law.'
        : 'Aviso de Prácticas de Privacidad HIPAA para pacientes de Healing Minds Psychiatry. Conozca cómo su información de salud protegida es usada y protegida bajo la ley federal.',
      keywords: language === 'en'
        ? 'HIPAA notice, privacy practices, protected health information, patient rights, medical privacy, psychiatric privacy'
        : 'aviso HIPAA, prácticas privacidad, información salud protegida, derechos paciente, privacidad médica, privacidad psiquiátrica',
      lang: language,
      canonical: language === 'en' ? '/hipaa-notice' : '/es/aviso-hipaa'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'HIPAA Notice of Privacy Practices' : 'Aviso de Prácticas de Privacidad HIPAA'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="hipaa-notice-content">
            {language === 'en' ? (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Effective Date: [DATE TO BE PROVIDED]
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300 text-center font-medium">
                    This HIPAA Notice of Privacy Practices is required by federal law for all healthcare providers.
                    Content will be provided by the practice administrator to ensure full HIPAA compliance.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    Content for this HIPAA notice will be provided by the practice administrator.
                    This page has been optimized for search engines and is ready to receive the legal content.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
                  Fecha de Vigencia: [FECHA A SER PROPORCIONADA]
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300 text-center font-medium">
                    Este Aviso de Prácticas de Privacidad HIPAA es requerido por la ley federal para todos los proveedores de salud.
                    El contenido será proporcionado por el administrador de la práctica para asegurar el cumplimiento completo de HIPAA.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                    El contenido de este aviso HIPAA será proporcionado por el administrador de la práctica.
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

export default HipaaNotice;