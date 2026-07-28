import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { cancellationPolicyContent } from '@/data/pageContent/legal/cancellationPolicy';

const CancellationPolicy = () => {
  const { language } = useLanguage();
  const content = cancellationPolicyContent[language];
  const s = (k: string) => content.sections.find((x) => x.key === k)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Cancellation & No-Show Policy | Healing Minds Psychiatry'
        : 'Política de Cancelación y No Asistencia | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Please review our 24-hour cancellation and no-show policy for appointments at Healing Minds Psychiatry in Naples, FL.'
        : 'Por favor revise nuestra política de cancelación de 24 horas y no asistencia para citas en Healing Minds Psychiatry en Naples, FL.',
      keywords: language === 'en'
        ? 'cancellation policy, no-show policy, appointment cancellation, late cancellation fee, psychiatry appointments Naples'
        : 'política cancelación, política no asistencia, cancelación citas, cargo cancelación tardía, citas psiquiatría Naples',
      lang: language,
      canonical: language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="cancellation-policy-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('intro').paragraphs![1]} />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('requirement').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('requirement').paragraphs![0]} />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('fee').heading}</h2>
                <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                  <li>
                    <RichText text={s('fee').bullets![0]} />
                  </li>
                  <li>
                    <RichText text={s('fee').bullets![1]} />
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('confirmation').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('confirmation').paragraphs![0]} />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('exceptions').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('exceptions').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('acknowledgment').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('acknowledgment').paragraphs![0]}
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

export default CancellationPolicy;
