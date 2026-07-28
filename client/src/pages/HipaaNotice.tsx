import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { hipaaNoticeContent } from '@/data/pageContent/legal/hipaaNotice';

const HipaaNotice = () => {
  const { language } = useLanguage();
  const content = hipaaNoticeContent[language];
  const s = (k: string) => content.sections.find(x => x.key === k)!;

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

  const address = s('address');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="hipaa-notice-content">
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg mb-6">
                  <p className="text-blue-800 dark:text-blue-300 font-semibold text-lg">
                    {address.paragraphs![0]}<br />
                    {address.paragraphs![1]}<br />
                    {address.paragraphs![2]}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">
                  {s('effective-date').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {s('intro').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('uses-disclosures').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('uses-disclosures').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('uses-disclosures').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('treatment').heading}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('treatment').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('payment').heading}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('payment').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('healthcare-operations').heading}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('healthcare-operations').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('use-required').heading}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('use-required').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('your-rights').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('your-rights').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">{s('right-inspect').heading}</h4>
                  <p className="text-green-800 dark:text-green-300">
                    {s('right-inspect').paragraphs![0]}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">{s('right-restrictions').heading}</h4>
                  <p className="text-blue-800 dark:text-blue-300">
                    {s('right-restrictions').paragraphs![0]}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">{s('right-confidential').heading}</h4>
                  <p className="text-purple-800 dark:text-purple-300">
                    {s('right-confidential').paragraphs![0]}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">{s('right-accounting').heading}</h4>
                  <p className="text-orange-800 dark:text-orange-300">
                    {s('right-accounting').paragraphs![0]}
                  </p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 p-6 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3">{s('right-amendment').heading}</h4>
                  <p className="text-indigo-800 dark:text-indigo-300">
                    {s('right-amendment').paragraphs![0]}
                  </p>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700 p-6 rounded-lg">
                  <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-3">{s('right-paper').heading}</h4>
                  <p className="text-pink-800 dark:text-pink-300">
                    {s('right-paper').paragraphs![0]}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s('complaints').heading}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('complaints').paragraphs![0]}
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-3">{s('legal-requirements').heading}</h3>
                <p className="text-red-800 dark:text-red-300">
                  {s('legal-requirements').paragraphs![0]}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{s('patient-signature').heading}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                  {s('patient-signature').paragraphs![0]}
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

export default HipaaNotice;
