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
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-3 mb-6">
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
                  {title.en.includes('Naples, FL') ? (
                    <>
                      {title.en.split(' in Naples, FL')[0]} in{' '}
                      <span className="font-display italic text-green-700">Naples, FL</span>
                    </>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: title.en }} />
                  )}
                </>
              ) : (
                <>
                  {title.es.includes('Naples, FL') ? (
                    <>
                      {title.es.split(' en Naples, FL')[0]} en{' '}
                      <span className="font-display italic text-green-700">Naples, FL</span>
                    </>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: title.es }} />
                  )}
                </>
              )}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
              {language === 'en' ? description.en : description.es}
            </p>

            {language === 'es' && specialNote?.es && (
              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8">
                <p className="text-blue-800 font-body">
                  <span dangerouslySetInnerHTML={{ __html: specialNote.es }} />
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
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
          
          {/* Right Column - True Masonry Style Layout */}
          <div className="relative">
            <div className="grid grid-cols-2 grid-rows-3 gap-4 max-w-lg mx-auto lg:max-w-none h-96 lg:h-[32rem]">
              {/* Top Left - Doctor Photo (Large - spans 2 rows) */}
              <div className="row-span-2 col-start-1 row-start-1">
                <div className="h-full rounded-2xl shadow-lg overflow-hidden">
                  <img 
                    src={images.doctorImage}
                    alt="Dr. Melva Reve - Mental Health Specialist"
                    className="w-full h-full object-cover"
                    data-testid="img-doctor-portrait"
                  />
                </div>
              </div>

              {/* Top Right - Facts Card (Small - 1 row) */}
              <div className="row-span-1 col-start-2 row-start-1">
                <div className="bg-white rounded-2xl shadow-lg p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <WellnessIcon size="sm" color="purple">
                      <IconHeart />
                    </WellnessIcon>
                    <h3 className="text-sm font-body font-bold text-green-800">
                      {language === 'en' ? facts.title.en : facts.title.es}
                    </h3>
                  </div>
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    {facts.items.slice(0, 2).map((fact, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-gray-700 font-body leading-relaxed">
                          {language === 'en' ? fact.en : fact.es}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Left - Quick Stats Card (Small - 1 row) */}
              <div className="row-span-1 col-start-1 row-start-3">
                <div className="bg-gradient-to-br from-green-800 to-green-700 text-white rounded-2xl shadow-lg p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    <h3 className="text-sm font-body font-bold">
                      {language === 'en' ? 'Quick Access' : 'Acceso Rápido'}
                    </h3>
                  </div>
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    {quickStats.items.slice(0, 3).map((stat, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0 opacity-80"></div>
                        <p className="text-xs opacity-90 font-body leading-relaxed">
                          {language === 'en' ? stat.en : stat.es}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Right - Therapy Room Photo (Large - spans 2 rows) */}
              <div className="row-span-2 col-start-2 row-start-2">
                <div className="h-full rounded-2xl shadow-lg overflow-hidden">
                  <img 
                    src={images.therapyRoomImage}
                    alt="Comfortable therapy environment"
                    className="w-full h-full object-cover"
                    data-testid="img-therapy-room"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};