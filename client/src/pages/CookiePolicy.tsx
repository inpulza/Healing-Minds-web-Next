import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { cookiePolicyContent } from '@/data/pageContent/legal/cookiePolicy';

const CookiePolicy = () => {
  const { language } = useLanguage();
  const content = cookiePolicyContent[language];
  const s = (k: string) => content.sections.find(x => x.key === k)!;

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

  const contact = s('contact');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="cookie-policy-content">
            <div className="space-y-8">
              <p className="text-gray-600 dark:text-gray-300 text-center mb-12 font-semibold">
                {s('last-updated').paragraphs![0]}
              </p>

              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('what-are-cookies').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('what-are-cookies').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('types-intro').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('types-intro').paragraphs![0]}
                </p>

                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">{s('types-necessary').heading}</h3>
                    <p className="text-blue-800 dark:text-blue-300">
                      {s('types-necessary').paragraphs![0]}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">{s('types-analytics').heading}</h3>
                    <p className="text-green-800 dark:text-green-300 mb-3">
                      {s('types-analytics').paragraphs![0]}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-300 ml-4">
                      {s('types-analytics').bullets!.map((b, i) => (
                        <li key={i}><RichText text={b} /></li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">{s('types-marketing').heading}</h3>
                    <p className="text-purple-800 dark:text-purple-300 mb-3">
                      {s('types-marketing').paragraphs![0]}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-300 ml-4">
                      {s('types-marketing').bullets!.map((b, i) => (
                        <li key={i}><RichText text={b} /></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('manage').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('manage').paragraphs![0]}
                </p>
                
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 ml-4">
                  {s('manage').bullets!.map((b, i) => (
                    <li key={i}><RichText text={b} /></li>
                  ))}
                  <li>
                    <RichText text={s('manage-optout').paragraphs![0]} />
                    <ul className="list-disc list-inside mt-2 ml-6 space-y-1">
                      {s('manage-optout').bullets!.map((b, i) => (
                        <li key={i}><RichText text={b} linkClassName="text-blue-600 dark:text-blue-400 underline" /></li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('third-party').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('third-party').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('changes').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('changes').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{contact.heading}</h2>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    {contact.paragraphs![0]}
                  </p>
                  <div className="mt-4 space-y-2 text-green-800 dark:text-green-300">
                    <p className="font-semibold"><RichText text={contact.paragraphs![1]} /></p>
                    <p>{contact.paragraphs![2]}</p>
                    <p>{contact.paragraphs![3]}</p>
                    <p>{contact.paragraphs![4]}</p>
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

export default CookiePolicy;
