import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import WellnessIcon from "@/components/WellnessIcon";
import { 
  Calendar, 
  ArrowRight, 
  Phone, 
  Clock, 
  MapPin
} from "lucide-react";
import { IconSun, IconHeart, IconBrain } from '@tabler/icons-react';
import { useLanguage } from "@/hooks/useLanguage";

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

  return (
    <section className="pt-20 pb-8 sm:pb-12 lg:pb-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text Content Section - Full Width */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <WellnessIcon size="sm" color="blue">
              <IconSun />
            </WellnessIcon>
            <span className="text-blue-700 font-body font-semibold text-lg">
              {language === 'en' ? tagline.en : tagline.es}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
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
                <Calendar className="w-5 h-5" />
                {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3"
              data-testid="button-call-now"
            >
              <Phone className="w-5 h-5" />
              <a href="tel:+1-239-555-0123" className="flex items-center gap-3">
                {language === 'en' ? 'Call Now' : 'Llamar Ahora'}
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Carousel - Perpetual Motion */}
        <div className="mt-16">
          <div className="relative overflow-hidden py-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
            <div className="flex animate-scroll space-x-8">
              {/* Facts Items */}
              {facts.items.concat(facts.items).map((fact, index) => (
                <div key={`fact-${index}`} className="flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg min-w-max">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <IconHeart className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-800 font-body font-medium">
                    {language === 'en' ? fact.en : fact.es}
                  </span>
                </div>
              ))}
              
              {/* Quick Stats Items */}
              {quickStats.items.concat(quickStats.items).map((stat, index) => (
                <div key={`stat-${index}`} className="flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg min-w-max">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-800 font-body font-medium">
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