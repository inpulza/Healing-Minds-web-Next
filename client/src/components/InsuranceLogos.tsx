import { CircleDollarSign, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { homeContent } from '@/data/pageContent/mainPages/home';
import { renderRichText } from '@/components/RichText';
import { Link } from '@/lib/navigation';
import AcceptedInsuranceGallery from '@/components/AcceptedInsuranceGallery';

const InsuranceLogos = () => {
  const { language } = useLanguage();
  const content = homeContent[language];
  const section = (key: string) => content.sections.find((x) => x.key === key)!;

  const steps = language === 'en'
    ? [
        { icon: Phone, title: 'Ask the office', description: 'Confirm current participation for your specific plan before booking.' },
        { icon: ShieldCheck, title: 'Verify with your insurer', description: 'Benefits, deductibles, copays and telehealth coverage vary by plan and service.' },
        { icon: CircleDollarSign, title: 'Discuss billing options', description: 'Self-pay or financial options may be evaluated case by case.' },
      ]
    : [
        { icon: Phone, title: 'Consulte con la oficina', description: 'Confirme la participación vigente para su plan específico antes de reservar.' },
        { icon: ShieldCheck, title: 'Verifique con su aseguradora', description: 'Los beneficios, deducibles, copagos y la cobertura de telesalud varían según el plan y el servicio.' },
        { icon: CircleDollarSign, title: 'Consulte opciones de facturación', description: 'Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.' },
      ];

  return (
    <section className="scroll-mt-24 bg-white py-8 sm:scroll-mt-28 sm:py-12 lg:scroll-mt-32 lg:py-16" data-testid="insurance-billing-guidance">
      <div className="max-w-[85%] lg:max-w-[90%] mx-auto px-2">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body font-bold text-green-800 mb-4">
            {renderRichText(section('insuranceHeading').heading!, undefined, 'font-display italic text-green-700')}
          </h2>
          <p className="text-lg text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
            {section('insuranceHeading').paragraphs![0]}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
          <div className="mb-8 border-b border-gray-200 pb-8">
            <h3 className="mb-5 text-center font-body text-xl font-semibold text-green-900 sm:text-2xl">
              {language === 'en' ? 'Accepted insurance plans' : 'Planes de seguro aceptados'}
            </h3>
            <AcceptedInsuranceGallery
              testId="accepted-insurance-gallery"
              testIdPrefix="insurance-logo"
              mobileTestId="mobile-insurance-carousel"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <Icon className="mx-auto mb-4 h-7 w-7 text-green-700" aria-hidden="true" />
                <h3 className="mb-2 font-body text-lg font-semibold text-green-900">{title}</h3>
                <p className="font-body text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-body mb-3">{section('insuranceNote').paragraphs![0]}</p>
            <Link
              href={language === 'en' ? '/billing-policy' : '/es/politica-facturacion'}
              className="font-body text-sm font-semibold text-green-800 underline underline-offset-4 hover:text-green-700"
            >
              {language === 'en' ? 'Review billing policy' : 'Revisar la política de facturación'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceLogos;
