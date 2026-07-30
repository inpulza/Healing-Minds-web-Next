import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Check, FileText, Shield, DollarSign, Phone, Receipt, Video } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { forPatientsSectionContent } from '@/data/pageContent/mainPages/sharedSections';

const ForPatients = () => {
  const { language } = useLanguage();

  const content = forPatientsSectionContent[language];
  const s = (key: string) => content.sections.find((section) => section.key === key)!;

  const insuranceFeatures = s('insuranceFeatures').bullets!;

  const expectationsSection = s('expectations');
  const expectations = expectationsSection.bullets!.map((title, i) => ({
    title,
    description: expectationsSection.paragraphs![i]
  }));

  const policyCardsSection = s('policyCards');
  const policyTitles = policyCardsSection.bullets!;
  const policyDescriptions = policyCardsSection.paragraphs!;

  return (
    <section id="for-patients" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-body font-bold text-gray-900 mb-6" data-testid="for-patients-title">
            {language === 'en' ? <>For <span className="font-display italic text-green-700">Patients</span></> : <>Para <span className="font-display italic text-green-700">Pacientes</span></>}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto" data-testid="for-patients-description">
            {s('description').paragraphs![0]}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Insurance & Payment */}
          <Card className="bg-light-green p-8" data-testid="insurance-payment-card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {s('insurancePaymentHeading').heading}
            </h3>
            <div className="space-y-4 mb-6">
              {insuranceFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-primary-green mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {s('insuranceNote').paragraphs![0]}
            </p>
          </Card>

          {/* What to Expect */}
          <Card className="bg-light-green-secondary p-8" data-testid="what-to-expect-card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {s('whatToExpectHeading').heading}
            </h3>
            <div className="space-y-4">
              {expectations.map((expectation, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {expectation.title}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {expectation.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Important Policies Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            {s('importantPoliciesHeading').heading}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href={language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion'} data-testid="link-cancellation-policy">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <FileText className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {policyTitles[0]}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {policyDescriptions[0]}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/billing-policy' : '/es/politica-facturacion'} data-testid="link-billing-policy">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <DollarSign className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {policyTitles[1]}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {policyDescriptions[1]}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/emergency-policy' : '/es/politica-emergencias'} data-testid="link-emergency-policy">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <Phone className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {policyTitles[2]}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {policyDescriptions[2]}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/patient-rights' : '/es/derechos-paciente'} data-testid="link-patient-rights">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {policyTitles[3]}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {policyDescriptions[3]}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/no-surprises-act' : '/es/ley-sin-sorpresas'} data-testid="link-no-surprises-act">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <Receipt className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {policyTitles[4]}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {policyDescriptions[4]}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/telehealth-consent' : '/es/consentimiento-telesalud'} data-testid="link-telehealth-consent">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <Video className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {policyTitles[5]}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {policyDescriptions[5]}
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ForPatients;
