import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Video, ShieldCheck } from 'lucide-react';
import RichText from '@/components/RichText';
import { telehealthConsentContent } from '@/data/pageContent/legal/telehealthConsent';

const TelehealthConsent = () => {
  const { language } = useLanguage();
  const content = telehealthConsentContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Telehealth Informed Consent | Healing Minds Psychiatry'
        : 'Consentimiento Informado de Telesalud | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Understand how telepsychiatry works at Healing Minds Psychiatry, including benefits, limitations, your responsibilities, and your right to withdraw consent at any time.'
        : 'Comprenda cómo funciona la telepsiquiatría en Healing Minds Psychiatry, incluidos los beneficios, las limitaciones, sus responsabilidades y su derecho a retirar el consentimiento en cualquier momento.',
      keywords: language === 'en'
        ? 'telehealth consent, telepsychiatry, informed consent, virtual psychiatry, Florida telehealth, California telehealth, secure video visit'
        : 'consentimiento telesalud, telepsiquiatría, consentimiento informado, psiquiatría virtual, telesalud Florida, telesalud California, videoconsulta segura',
      lang: language,
      canonical: language === 'en' ? '/telehealth-consent' : '/es/consentimiento-telesalud'
    };
    updateSEO(seoData);
  }, [language]);

  const updated = s('updated');
  const intro = s('intro');
  const whatIs = s('what-is');
  const legalBasis = s('legal-basis');
  const benefits = s('benefits');
  const limitations = s('limitations');
  const notEmergency = s('not-emergency');
  const responsibilities = s('responsibilities');
  const confidentiality = s('confidentiality');
  const prescriptions = s('prescriptions');
  const rights = s('rights');
  const acknowledgment = s('acknowledgment');
  const contact = s('contact');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-4 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-12">
            {updated.paragraphs![0]}
          </p>

          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="telehealth-consent-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {intro.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Video className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{whatIs.heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {whatIs.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{legalBasis.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {legalBasis.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{benefits.heading}</h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {benefits.bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{limitations.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {limitations.paragraphs![0]}
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {limitations.bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{notEmergency.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {notEmergency.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{responsibilities.heading}</h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {responsibilities.bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{confidentiality.heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {confidentiality.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{prescriptions.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {prescriptions.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{rights.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {rights.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{acknowledgment.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {acknowledgment.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{contact.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={contact.paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
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

export default TelehealthConsent;
