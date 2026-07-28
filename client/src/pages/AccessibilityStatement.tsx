import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { Accessibility, Heart } from 'lucide-react';
import { accessibilityStatementContent } from '@/data/pageContent/legal/accessibilityStatement';

const AccessibilityStatement = () => {
  const { language } = useLanguage();
  const content = accessibilityStatementContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Accessibility Statement | Healing Minds Psychiatry'
        : 'Declaración de Accesibilidad | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Healing Minds Psychiatry is committed to a website accessible to people with disabilities, consistent with the ADA and WCAG 2.1 Level AA. Learn about our accessibility efforts.'
        : 'Healing Minds Psychiatry se compromete a mantener un sitio web accesible para personas con discapacidades, conforme a la ADA y las WCAG 2.1 Nivel AA. Conozca nuestros esfuerzos de accesibilidad.',
      keywords: language === 'en'
        ? 'accessibility statement, ADA compliance, WCAG 2.1 AA, website accessibility, disability access, auxiliary aids, language assistance'
        : 'declaración accesibilidad, cumplimiento ADA, WCAG 2.1 AA, accesibilidad sitio web, acceso discapacidad, ayudas auxiliares, asistencia de idioma',
      lang: language,
      canonical: language === 'en' ? '/accessibility-statement' : '/es/declaracion-accesibilidad'
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

          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="accessibility-statement-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Accessibility className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('commitment').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('commitment').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('measures').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('measures').paragraphs![0]}
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {s('measures').bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('ongoing').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('ongoing').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('feedback').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('feedback').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('auxiliary').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('auxiliary').paragraphs![0]}
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

export default AccessibilityStatement;
