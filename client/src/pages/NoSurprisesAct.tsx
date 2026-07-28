import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { ShieldCheck, FileText } from 'lucide-react';
import { noSurprisesActContent } from '@/data/pageContent/legal/noSurprisesAct';

const NoSurprisesAct = () => {
  const { language } = useLanguage();
  const content = noSurprisesActContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'No Surprises Act & Good Faith Estimate | Healing Minds Psychiatry'
        : 'Ley Sin Sorpresas y Estimado de Buena Fe | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Learn about your rights under the federal No Surprises Act, protections against balance billing, and how to request a Good Faith Estimate at Healing Minds Psychiatry.'
        : 'Conozca sus derechos bajo la Ley Federal Sin Sorpresas, las protecciones contra la facturación de saldo y cómo solicitar un Estimado de Buena Fe en Healing Minds Psychiatry.',
      keywords: language === 'en'
        ? 'No Surprises Act, Good Faith Estimate, balance billing protection, uninsured self-pay, patient provider dispute resolution, psychiatry billing rights'
        : 'Ley Sin Sorpresas, Estimado de Buena Fe, protección facturación de saldo, sin seguro pago privado, resolución de disputas paciente proveedor, derechos facturación psiquiatría',
      lang: language,
      canonical: language === 'en' ? '/no-surprises-act' : '/es/ley-sin-sorpresas'
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
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            {s('updated').paragraphs![0]}
          </p>

          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="no-surprises-act-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('balance-billing').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('balance-billing').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('balance-billing').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('good-faith-estimate').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('good-faith-estimate').paragraphs![0]}
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {s('good-faith-estimate').bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('higher-bill').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('higher-bill').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('learn-more').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('learn-more').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('request-estimate').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('request-estimate').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
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

export default NoSurprisesAct;
