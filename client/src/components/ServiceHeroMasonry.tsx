import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import WellnessIcon from "@/components/WellnessIcon";
import { 
  Calendar, 
  ArrowRight, 
  Phone, 
  Clock, 
  MapPin,
  Sun,
  Heart,
  Brain
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useClarity } from "@/hooks/use-clarity";

interface ServiceHeroMasonryProps {
  tagline: {
    en: string;
    es: string;
  };
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  facts: {
    title: {
      en: string;
      es: string;
    };
    items: Array<{
      en: string;
      es: string;
    }>;
  };
  images: {
    doctorImage: string;
    therapyRoomImage: string;
    symbolImage: string;
  };
  specialNote?: {
    es?: string;
  };
  quickStats: {
    items: Array<{
      en: string;
      es: string;
    }>;
  };
}

export const ServiceHeroMasonry = ({ 
  tagline, 
  title, 
  description, 
  facts, 
  images, 
  specialNote,
  quickStats 
}: ServiceHeroMasonryProps) => {
  const { language } = useLanguage();
  const { trackEvent, setTag } = useClarity();

  return (
    <section className="pt-20 pb-8 sm:pb-12 lg:pb-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        {/* Text Content Section - Full Width */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <WellnessIcon size="sm" color="blue">
              <Sun />
            </WellnessIcon>
            <span className="text-blue-700 font-body font-semibold text-lg">
              {language === 'en' ? tagline.en : tagline.es}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
            {language === 'en' ? (
              <>
                {title.en.includes('<span') ? (
                  <span dangerouslySetInnerHTML={{ __html: title.en }} />
                ) : title.en.includes('Naples, FL') ? (
                  <>
                    {title.en.split(' in Naples, FL')[0]} in{' '}
                    <span className="font-display italic text-green-700">Naples, FL</span>
                  </>
                ) : (
                  title.en
                )}
              </>
            ) : (
              <>
                {title.es.includes('<span') ? (
                  <span dangerouslySetInnerHTML={{ __html: title.es }} />
                ) : title.es.includes('Naples, FL') ? (
                  <>
                    {title.es.split(' en Naples, FL')[0]} en{' '}
                    <span className="font-display italic text-green-700">Naples, FL</span>
                  </>
                ) : (
                  title.es
                )}
              </>
            )}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed max-w-4xl mx-auto">
            {language === 'en' ? description.en : description.es}
          </p>

          {language === 'es' && specialNote?.es && (
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8 max-w-4xl mx-auto">
              <p className="text-blue-800 font-body">
                <span dangerouslySetInnerHTML={{ __html: specialNote.es }} />
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300"
                data-testid="button-schedule-consultation"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3"
              data-testid="button-call-now"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                <Phone className="w-4 h-4 text-green-800" />
              </div>
              <a 
                href="tel:+12394230272" 
                className="flex items-center gap-3"
                onClick={() => {
                  trackEvent('phone_call_initiated');
                  setTag('phone_click_location', 'service_hero');
                }}
              >
                {language === 'en' ? 'Call Now' : 'Llamar Ahora'}
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Tags - Masonry Style */}
        <div className="mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Facts Items */}
              {facts.items.map((fact, index) => (
                <div key={`fact-${index}`} className="flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-green-100">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-body font-medium text-sm">
                    {language === 'en' ? fact.en : fact.es}
                  </span>
                </div>
              ))}
              
              {/* Quick Stats Items */}
              {quickStats.items.map((stat, index) => (
                <div key={`stat-${index}`} className="flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-blue-100">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-body font-medium text-sm">
                    {language === 'en' ? stat.en : stat.es}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};