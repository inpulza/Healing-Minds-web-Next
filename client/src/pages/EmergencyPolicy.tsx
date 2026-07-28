import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { AlertTriangle, Phone } from 'lucide-react';
import RichText from '@/components/RichText';
import { emergencyPolicyContent } from '@/data/pageContent/legal/emergencyPolicy';

const EmergencyPolicy = () => {
  const { language } = useLanguage();
  const content = emergencyPolicyContent[language];
  const s = (k: string) => content.sections.find((x) => x.key === k)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Emergency & Crisis Policy | Healing Minds Psychiatry'
        : 'Política de Emergencia y Crisis | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Important information regarding mental health emergencies. Healing Minds Psychiatry is not an emergency service. Know who to call in a crisis.'
        : 'Información importante sobre emergencias de salud mental. Healing Minds Psychiatry no es un servicio de emergencia. Sepa a quién llamar en una crisis.',
      keywords: language === 'en'
        ? 'mental health emergency, crisis policy, suicide prevention, 988 lifeline, Baker Act Florida, crisis intervention'
        : 'emergencia salud mental, política crisis, prevención suicidio, línea 988, Baker Act Florida, intervención crisis',
      lang: language,
      canonical: language === 'en' ? '/emergency-policy' : '/es/politica-emergencias'
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
          
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="emergency-policy-content">
            <div className="space-y-8">
              {/* Alert Banner */}
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">{s('alert-banner').heading}</h3>
                    <p className="text-red-700 dark:text-red-300">
                      {s('alert-banner').paragraphs![0]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('not-emergency').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('not-emergency').paragraphs![0]} />
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('not-emergency').paragraphs![1]} />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('in-case').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('in-case').paragraphs![0]} />
                </p>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    {s('actions').heading}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-600 pl-4">
                      <p className="font-bold text-gray-900 dark:text-white">{s('action-1').paragraphs![0]}</p>
                      <p className="text-gray-700 dark:text-gray-300">{s('action-1').paragraphs![1]}</p>
                    </div>
                    
                    <div className="border-l-4 border-green-600 pl-4">
                      <p className="font-bold text-gray-900 dark:text-white">{s('action-2').paragraphs![0]}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <RichText text={s('action-2').paragraphs![1]} />
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s('action-2').paragraphs![2]}</p>
                    </div>

                    <div className="border-l-4 border-green-600 pl-4">
                      <p className="font-bold text-gray-900 dark:text-white">{s('action-3').paragraphs![0]}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <RichText text={s('action-3').paragraphs![1]} />
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-600 pl-4">
                      <p className="font-bold text-gray-900 dark:text-white">{s('action-4').paragraphs![0]}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <RichText text={s('action-4').paragraphs![1]} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('florida-resources').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('florida-resources').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('florida-resources').paragraphs![1]} />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('communication').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('communication').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('communication').paragraphs![1]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('baker-act').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('baker-act').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('baker-act').paragraphs![1]}
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

export default EmergencyPolicy;
