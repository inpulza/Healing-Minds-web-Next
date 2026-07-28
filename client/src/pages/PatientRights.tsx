import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Shield, Heart } from 'lucide-react';
import RichText from '@/components/RichText';
import { patientRightsContent } from '@/data/pageContent/legal/patientRights';

const PatientRights = () => {
  const { language } = useLanguage();
  const content = patientRightsContent[language];
  const s = (key: string) => content.sections.find((x) => x.key === key)!;

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Patient Rights & Responsibilities | Healing Minds Psychiatry'
        : 'Derechos y Responsabilidades del Paciente | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Learn about your rights and responsibilities as a patient at Healing Minds Psychiatry, ensuring a respectful and collaborative therapeutic relationship.'
        : 'Conozca sus derechos y responsabilidades como paciente en Healing Minds Psychiatry, asegurando una relación terapéutica respetuosa y colaborativa.',
      keywords: language === 'en'
        ? 'patient rights, patient responsibilities, HIPAA, confidentiality, informed consent, mental health rights Florida'
        : 'derechos paciente, responsabilidades paciente, HIPAA, confidencialidad, consentimiento informado, derechos salud mental Florida',
      lang: language,
      canonical: language === 'en' ? '/patient-rights' : '/es/derechos-paciente'
    };
    updateSEO(seoData);
  }, [language]);

  const intro = s('intro');
  const rights = s('rights');
  const responsibilities = s('responsibilities');
  const complaint = s('filing-complaint');
  const complaintParas = complaint.paragraphs!;
  const acknowledgment = s('acknowledgment');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {content.title}
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="patient-rights-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {intro.paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{rights.heading}</h2>
                </div>

                <p className="text-gray-700 dark:text-gray-300">
                  {rights.paragraphs![0]}
                </p>

                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {rights.bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">{responsibilities.heading}</h2>
                </div>

                <p className="text-gray-700 dark:text-gray-300">
                  {responsibilities.paragraphs![0]}
                </p>

                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {responsibilities.bullets!.map((bullet, i) => (
                    <li key={i}>
                      <RichText text={bullet} linkClassName="text-green-600 hover:text-green-700 underline" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{complaint.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {complaintParas[0]}
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{complaintParas[1]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[2]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[3]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[4]}</p>
                    <p className="text-gray-700 dark:text-gray-300"><RichText text={complaintParas[5]} linkClassName="text-green-600 hover:text-green-700 underline" /></p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{complaintParas[6]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[7]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[8]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[9]}</p>
                    <p className="text-gray-700 dark:text-gray-300">{complaintParas[10]}</p>
                    <p className="text-gray-700 dark:text-gray-300"><RichText text={complaintParas[11]} linkClassName="text-green-600 hover:text-green-700 underline" /></p>
                    <p className="text-gray-700 dark:text-gray-300"><RichText text={complaintParas[12]} linkClassName="text-green-600 hover:text-green-700 underline" /></p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{acknowledgment.heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {acknowledgment.paragraphs![0]}
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

export default PatientRights;
