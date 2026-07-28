import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { termsOfServiceContent } from '@/data/pageContent/legal/termsOfService';

const TermsOfService = () => {
  const { language } = useLanguage();
  const content = termsOfServiceContent[language];
  const s = (k: string) => content.sections.find((x) => x.key === k)!;

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
            {content.title}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="terms-of-service-content">
            <div className="space-y-8">
              <p className="text-gray-600 dark:text-gray-300 text-center mb-12 font-semibold">
                {s('last-updated').paragraphs![0]}
              </p>

              <div className="space-y-6">
                {s('intro').paragraphs!.map((p, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300">
                    {p}
                  </p>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('1').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('1').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('2').heading}</h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 font-semibold uppercase">
                    {s('2').paragraphs![0]}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 font-bold">
                    {s('2').paragraphs![1]}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('3').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('3').paragraphs![0]}
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('3a').heading}</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {s('3a').paragraphs![0]}
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('3b').heading}</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {s('3b').paragraphs![0]}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('4').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('4').paragraphs![0]}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                  {s('4').bullets!.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('5').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('5').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('6').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('6').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('7').heading}</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-300 font-semibold uppercase">
                    {s('7').paragraphs![0]}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('8').heading}</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-300 font-semibold uppercase">
                    {s('8').paragraphs![0]}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('9').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('9').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('10').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('10').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('11').heading}</h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    {s('11').paragraphs![0]}
                  </p>
                  <div className="mt-4 space-y-2 text-green-800 dark:text-green-300">
                    <p className="font-semibold">{s('11').paragraphs![1]}</p>
                    <p>{s('11').paragraphs![2]}</p>
                    <p>{s('11').paragraphs![3]}</p>
                    <p>{s('11').paragraphs![4]}</p>
                    <p>{s('11').paragraphs![5]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
