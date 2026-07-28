import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { getCorrespondingURL } from '@/utils/urlMapping';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import doctorImage from '@assets/doctor-consultation-square.webp';
import { doctorSectionContent } from '@/data/pageContent/mainPages/sharedSections';

const DoctorSection = () => {
  const { language } = useLanguage();

  // This section is reused on Spanish routes (including /es/psiquiatra-california),
  // so the CTA must stay in the visitor's language: a hardcoded /services would
  // flip the URL-driven language context back to English.
  const servicesHref = language === 'es'
    ? getCorrespondingURL('/services', 'es') ?? '/es/servicios'
    : '/services';

  const content = doctorSectionContent[language];
  const s = (key: string) => content.sections.find((section) => section.key === key)!;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 shadow-lg border border-green-100">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Content */}
            <div className="text-green-800 order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold mb-4 sm:mb-6" data-testid="doctor-section-title">
                {language === 'en' 
                  ? <>Dedicated to your <span className="font-display italic text-green-700">mental health</span>, every day</>
                  : <>Dedicados a su <span className="font-display italic text-green-700">salud mental</span>, todos los días</>
                }
              </h2>
              
              <div className="mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600" data-testid="patient-count">15+</div>
                <div className="text-gray-600 font-body text-sm sm:text-base" data-testid="patient-label">
                  {s('yearsLabel').paragraphs![0]}
                </div>
              </div>

              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed" data-testid="doctor-section-description">
                {s('description').paragraphs![0]}
              </p>

              <Link href={servicesHref}>
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-6 sm:px-8 py-6 sm:py-7"
                  data-testid="explore-services-button"
                >
                  <span>{s('cta').bullets![0]}</span>
                  <ArrowRight className="w-8 h-8 sm:w-9 sm:h-9 p-2 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full transition-all duration-300 bg-green-600 text-white flex-shrink-0" />
                </Button>
              </Link>
            </div>

            {/* Doctor Image */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={doctorImage}
                  alt="Dr. Melva Reve, MD - Engaged in consultation with a patient, demonstrating compassionate psychiatric care approach"
                  className="w-full h-full object-cover"
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  data-testid="doctor-section-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;