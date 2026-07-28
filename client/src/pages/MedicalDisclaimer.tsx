import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { AlertTriangle, Info } from 'lucide-react';
import { medicalDisclaimerContent } from '@/data/pageContent/legal/medicalDisclaimer';

const MedicalDisclaimer = () => {
  const { language } = useLanguage();
  const content = medicalDisclaimerContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Medical Disclaimer | Healing Minds Psychiatry'
        : 'Descargo de Responsabilidad Médica | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'The content on the Healing Minds Psychiatry website and blog is for general information only and is not medical advice, diagnosis, or treatment.'
        : 'El contenido del sitio web y del blog de Healing Minds Psychiatry es solo para información general y no constituye asesoramiento médico, diagnóstico ni tratamiento.',
      keywords: language === 'en'
        ? 'medical disclaimer, not medical advice, health information disclaimer, psychiatry disclaimer, no provider patient relationship'
        : 'descargo responsabilidad médica, no es asesoramiento médico, descargo información salud, descargo psiquiatría, sin relación proveedor paciente',
      lang: language,
      canonical: language === 'en' ? '/medical-disclaimer' : '/es/descargo-responsabilidad-medica'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-4 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-12">
            {s('updated').paragraphs![0]}
          </p>

          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="medical-disclaimer-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Info className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('general-info').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('general-info').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('no-relationship').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('no-relationship').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('seek-advice').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('seek-advice').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('emergency').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('emergency').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('content-accuracy').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('content-accuracy').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('external-links').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('external-links').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('testimonials').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('testimonials').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('contact').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('contact').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalDisclaimer;
