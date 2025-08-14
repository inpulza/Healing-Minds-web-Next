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
                <span dangerouslySetInnerHTML={{ __html: title.en }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: title.es }} />
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
          
          {/* Right Column - Masonry Layout */}
          <div className="relative">
            <div className="masonry-container columns-1 sm:columns-2 gap-4 space-y-4">
              {/* Large Doctor Photo */}
              <div className="break-inside-avoid mb-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img 
                    src={images.doctorImage}
                    alt="Dr. Melva Reve - Mental Health Specialist"
                    className="w-full h-48 sm:h-64 object-cover"
                    data-testid="img-doctor-portrait"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-body font-bold text-green-800 mb-2">
                      {language === 'en' ? 'Dr. Melva Reve' : 'Dra. Melva Reve'}
                    </h3>
                    <p className="text-sm text-gray-600 font-body">
                      {language === 'en' ? 'Board-Certified Psychiatrist' : 'Psiquiatra Certificada'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Facts Card */}
              <div className="break-inside-avoid mb-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <WellnessIcon size="sm" color="purple">
                      <IconHeart />
                    </WellnessIcon>
                    <h3 className="text-lg font-body font-bold text-green-800">
                      {language === 'en' ? facts.title.en : facts.title.es}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {facts.items.map((fact, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm text-gray-700 font-body">
                          {language === 'en' ? fact.en : fact.es}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Therapy Room Image */}
              <div className="break-inside-avoid mb-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img 
                    src={images.therapyRoomImage}
                    alt="Comfortable therapy environment"
                    className="w-full h-32 object-cover"
                    data-testid="img-therapy-room"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 font-body">
                      {language === 'en' ? 'Comfortable & Safe Environment' : 'Ambiente Cómodo y Seguro'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="break-inside-avoid mb-4">
                <div className="bg-gradient-to-br from-green-800 to-green-700 text-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6" />
                    <h3 className="text-lg font-body font-bold">
                      {language === 'en' ? 'Quick Access' : 'Acceso Rápido'}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {quickStats.items.map((stat, index) => (
                      <p key={index} className="text-sm opacity-90 font-body">
                        {language === 'en' ? stat.en : stat.es}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Symbol Image */}
              <div className="break-inside-avoid mb-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img 
                    src={images.symbolImage}
                    alt="Treatment success symbol"
                    className="w-full h-32 object-cover"
                    data-testid="img-treatment-symbol"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 font-body">
                      {language === 'en' ? 'Evidence-based treatment approaches' : 'Enfoques de tratamiento basados en evidencia'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="break-inside-avoid mb-4">
                <div className="bg-blue-50 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-body font-bold text-blue-800">
                      {language === 'en' ? 'Location' : 'Ubicación'}
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 font-body mb-2">
                    Naples, FL & Surrounding Areas
                  </p>
                  <p className="text-xs text-blue-600 font-body">
                    {language === 'en' ? 'Serving Southwest Florida' : 'Sirviendo al Suroeste de Florida'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};