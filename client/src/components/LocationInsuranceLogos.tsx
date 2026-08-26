import { CircleDollarSign, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from '@/lib/navigation';
import AcceptedInsuranceGallery from '@/components/AcceptedInsuranceGallery';

const LocationInsuranceLogos = () => {
  const { language } = useLanguage();
  const items = language === 'en'
    ? [
        { icon: Phone, title: 'Confirm participation', description: 'Ask the office whether the practice currently participates with your specific plan.' },
        { icon: ShieldCheck, title: 'Confirm your benefits', description: 'Ask your insurer about mental-health and telehealth benefits before booking.' },
        { icon: CircleDollarSign, title: 'Ask about billing options', description: 'Self-pay or financial options may be evaluated case by case.' },
      ]
    : [
        { icon: Phone, title: 'Confirme la participación', description: 'Pregunte a la oficina si la práctica participa actualmente con su plan específico.' },
        { icon: ShieldCheck, title: 'Confirme sus beneficios', description: 'Pregunte a su aseguradora por los beneficios de salud mental y telesalud antes de reservar.' },
        { icon: CircleDollarSign, title: 'Consulte opciones de facturación', description: 'Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.' },
      ];

  return (
    <section className="scroll-mt-24 bg-[#f0fdf4] py-8 sm:scroll-mt-28 sm:py-12 lg:scroll-mt-32 lg:py-16" data-testid="location-insurance-billing-guidance">
      <div className="max-w-[85%] lg:max-w-[90%] mx-auto px-2">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body font-bold text-green-800 mb-4">
            {language === 'en' ? (
              <>Insurance &amp; <span className="font-display italic text-green-700">Billing</span></>
            ) : (
              <>Seguro y <span className="font-display italic text-green-700">Facturación</span></>
            )}
          </h2>
          <p className="text-lg text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
            {language === 'en'
              ? 'Participation and benefits vary by plan and service. Confirm details with both the office and your insurer before booking.'
              : 'La participación y los beneficios varían según el plan y el servicio. Confirme los detalles con la oficina y su aseguradora antes de reservar.'}
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 bg-white">
          <div className="mb-8 border-b border-gray-200 pb-8">
            <h3 className="mb-5 text-center font-body text-xl font-semibold text-green-900 sm:text-2xl">
              {language === 'en' ? 'Accepted insurance plans' : 'Planes de seguro aceptados'}
            </h3>
            <AcceptedInsuranceGallery
              testId="location-accepted-insurance-gallery"
              testIdPrefix="location-insurance-logo"
              mobileTestId="mobile-location-insurance-carousel"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {items.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-gray-50 p-6 text-center">
                <Icon className="mx-auto mb-4 h-7 w-7 text-green-700" aria-hidden="true" />
                <h3 className="mb-2 font-body text-lg font-semibold text-green-900">{title}</h3>
                <p className="font-body text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
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

export default LocationInsuranceLogos;
