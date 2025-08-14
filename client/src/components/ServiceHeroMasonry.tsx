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
import { IconSun, IconHeart } from '@tabler/icons-react';
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

        {/* Hero Image with Overlaid Cards */}
        <div className="relative">
          <div className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl shadow-lg overflow-hidden">
            <img 
              src={images.doctorImage}
              alt="Dr. Melva Reve - Mental Health Specialist"
              className="w-full h-full object-cover"
              data-testid="img-doctor-portrait"
            />
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
          </div>

          {/* Overlaid Cards */}
          <div className="absolute inset-0 flex items-end justify-start p-6 lg:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
              {/* Facts Card */}
              <div className="bg-white/95 backdrop-blur-sm border border-green-200 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconHeart className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="text-lg font-body font-bold text-green-800">
                    {language === 'en' ? facts.title.en : facts.title.es}
                  </h3>
                </div>
                <div className="space-y-3">
                  {facts.items.slice(0, 2).map((fact, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm text-green-800 font-body font-medium leading-relaxed">
                        {language === 'en' ? fact.en : fact.es}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Facts Card */}
              <div className="bg-white/95 backdrop-blur-sm border border-green-200 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="text-lg font-body font-bold text-green-800">
                    {language === 'en' ? 'Quick Facts' : 'Datos Rápidos'}
                  </h3>
                </div>
                <div className="space-y-3">
                  {quickStats.items.slice(0, 3).map((stat, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <p className="text-sm text-green-800 font-body font-medium leading-relaxed">
                        {language === 'en' ? stat.en : stat.es}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};