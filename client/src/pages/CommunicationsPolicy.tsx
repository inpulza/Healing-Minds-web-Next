import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { MessageSquare, Phone } from 'lucide-react';
import { communicationsPolicyContent } from '@/data/pageContent/legal/communicationsPolicy';

const CommunicationsPolicy = () => {
  const { language } = useLanguage();
  const content = communicationsPolicyContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Communications Policy (SMS, WhatsApp, Email) | Healing Minds Psychiatry'
        : 'Política de Comunicaciones (SMS, WhatsApp, Email) | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Learn how Healing Minds Psychiatry communicates with patients by phone, email, SMS, and WhatsApp, including consent, opt-out, privacy, and risks.'
        : 'Conozca cómo Healing Minds Psychiatry se comunica con los pacientes por teléfono, correo electrónico, SMS y WhatsApp, incluyendo consentimiento, cancelación, privacidad y riesgos.',
      keywords: language === 'en'
        ? 'communications policy, SMS text messages, WhatsApp, appointment reminders, opt out, message rates, patient privacy'
        : 'política comunicaciones, mensajes de texto SMS, WhatsApp, recordatorios de citas, cancelar suscripción, tarifas mensajes, privacidad paciente',
      lang: language,
      canonical: language === 'en' ? '/communications-policy' : '/es/politica-comunicaciones'
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

          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="communications-policy-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('scope').heading}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('scope').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('consent').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('consent').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('consent').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('opt-out').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('opt-out').paragraphs![0]}
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {s('opt-out').bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('opt-out-note').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('not-emergencies').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('not-emergencies').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('privacy-risks').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('privacy-risks').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('privacy-risks').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('no-marketing').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('no-marketing').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('message-delivery').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('message-delivery').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{s('contact').heading}</h2>
                </div>
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

export default CommunicationsPolicy;
