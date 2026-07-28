import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { Scale, Globe } from 'lucide-react';
import { nondiscriminationNoticeContent } from '@/data/pageContent/legal/nondiscriminationNotice';

const NondiscriminationNotice = () => {
  const { language } = useLanguage();
  const content = nondiscriminationNoticeContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Nondiscrimination Notice | Healing Minds Psychiatry'
        : 'Aviso de No Discriminación | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Healing Minds Psychiatry complies with applicable federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex.'
        : 'Healing Minds Psychiatry cumple con las leyes federales de derechos civiles aplicables y no discrimina por motivos de raza, color, origen nacional, edad, discapacidad o sexo.',
      keywords: language === 'en'
        ? 'nondiscrimination notice, civil rights, language assistance, disability accommodations, Office for Civil Rights, mental health Florida'
        : 'aviso no discriminación, derechos civiles, asistencia idioma, adaptaciones discapacidad, Oficina de Derechos Civiles, salud mental Florida',
      lang: language,
      canonical: language === 'en' ? '/nondiscrimination-notice' : '/es/aviso-no-discriminacion'
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

          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="nondiscrimination-notice-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Scale className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('commitment').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('commitment').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('commitment').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('free-aids').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('free-aids').paragraphs![0]}
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {s('free-aids').bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('free-aids').paragraphs![1]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('grievance').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('grievance').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('grievance').paragraphs![1]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('hhs').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('hhs').paragraphs![0]}
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{s('hhs-online').heading}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <RichText text={s('hhs-online').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{s('hhs-mail').heading}</p>
                    <p className="text-gray-700 dark:text-gray-300">{s('hhs-mail').paragraphs![0]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{s('hhs-mail').paragraphs![1]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{s('hhs-mail').paragraphs![2]}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{s('hhs-phone').heading}</p>
                    <p className="text-gray-700 dark:text-gray-300">{s('hhs-phone').paragraphs![0]}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{s('hhs-forms').heading}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <RichText text={s('hhs-forms').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('questions').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('questions').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
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

export default NondiscriminationNotice;
