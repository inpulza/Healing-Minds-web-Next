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
import heroBackgroundImage from "@assets/7174605c-2d15-412a-808b-90c7364fbc2e_1755208270536.png";

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

        {/* Hero Image with Overlaid Content */}
        <div className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px] flex items-center justify-center">
          {/* Background Image with Blur */}
          <img 
            src={heroBackgroundImage}
            alt="Dr. Melva Reve - Mental Health Specialist"
            className="absolute inset-0 w-full h-full object-cover blur-sm"
            data-testid="img-doctor-portrait"
          />
          
          {/* Content Overlay */}
          <div className="relative z-10 w-full px-8 lg:px-16 py-16 text-left">
            <div className="max-w-6xl ml-4">
              {/* Large Text with Icons - Similar to Home Hero */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-bold leading-tight text-white mb-6">
                  <WellnessIcon size="lg" color="green" className="inline-flex mx-2 align-middle">
                    <IconHeart />
                  </WellnessIcon>
                  {language === 'en' ? 'Comprehensive' : 'Atención Integral'}
                  <br />
                  {language === 'en' ? 'Mental Health Care' : 'de Salud Mental'}
                  <WellnessIcon size="lg" color="blue" className="inline-flex mx-2 align-middle">
                    <IconBrain />
                  </WellnessIcon>
                </h2>
              </div>
              
              {/* Facts and Quick Stats - No visible containers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Facts Section */}
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <WellnessIcon size="md" color="orange">
                      <IconHeart />
                    </WellnessIcon>
                    <h3 className="text-2xl font-body font-bold text-white">
                      {language === 'en' ? facts.title.en : facts.title.es}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {facts.items.slice(0, 2).map((fact, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-lg text-white font-body leading-relaxed">
                          {language === 'en' ? fact.en : fact.es}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Facts Section */}
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <WellnessIcon size="md" color="blue">
                      <Clock />
                    </WellnessIcon>
                    <h3 className="text-2xl font-body font-bold text-white">
                      {language === 'en' ? 'Quick Facts' : 'Datos Rápidos'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {quickStats.items.slice(0, 3).map((stat, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                        <p className="text-lg text-white font-body leading-relaxed">
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
      </div>
    </section>
  );
};