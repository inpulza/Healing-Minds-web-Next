import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Navigation, Clock, Users } from 'lucide-react';

const ServiceAreas: React.FC = () => {
  const { language } = useLanguage();

  const serviceAreas = [
    {
      name: 'Naples, FL',
      population: '22,088',
      distance: language === 'en' ? 'Main Office' : 'Oficina Principal',
      coordinates: { lat: 26.1420, lng: -81.7948 }
    },
    {
      name: 'Marco Island, FL', 
      population: '17,963',
      distance: language === 'en' ? '20 min drive' : '20 min en auto',
      coordinates: { lat: 25.9412, lng: -81.7273 }
    },
    {
      name: 'Bonita Springs, FL',
      population: '57,755', 
      distance: language === 'en' ? '25 min drive' : '25 min en auto',
      coordinates: { lat: 26.3398, lng: -81.7787 }
    },
    {
      name: 'Estero, FL',
      population: '36,939',
      distance: language === 'en' ? '30 min drive' : '30 min en auto',
      coordinates: { lat: 26.4376, lng: -81.8067 }
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '150,000+',
      label: language === 'en' ? 'Residents Served' : 'Residentes Atendidos'
    },
    {
      icon: MapPin,
      value: '4',
      label: language === 'en' ? 'Service Areas' : 'Áreas de Servicio'
    },
    {
      icon: Clock,
      value: '30min',
      label: language === 'en' ? 'Max Drive Time' : 'Tiempo Máx. en Auto'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-green-50" data-testid="service-areas">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-green-800 mb-4 sm:mb-6" data-testid="service-areas-title">
            {language === 'en' 
              ? 'Serving Southwest Florida'
              : 'Sirviendo el Suroeste de Florida'
            }
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="service-areas-description">
            {language === 'en'
              ? 'Quality psychiatric care delivered across Collier County and surrounding areas. We bring professional mental health services to your community.'
              : 'Atención psiquiátrica de calidad entregada en el Condado de Collier y áreas circundantes. Llevamos servicios profesionales de salud mental a su comunidad.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Map Visualization */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-green-100">
              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Service Area Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-[320px] max-h-[240px]">
                    {/* Naples - Center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full shadow-lg animate-pulse"></div>
                        <div className="absolute -top-8 -left-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-green-800 bg-white px-2 py-1 rounded-md shadow-sm">Naples</span>
                        </div>
                      </div>
                    </div>

                    {/* Marco Island - Southwest */}
                    <div className="absolute bottom-1/4 left-1/4">
                      <div className="relative">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
                        <div className="absolute -top-8 -left-6 whitespace-nowrap">
                          <span className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm">Marco Island</span>
                        </div>
                      </div>
                    </div>

                    {/* Bonita Springs - North */}
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
                        <div className="absolute -top-8 -left-8 whitespace-nowrap">
                          <span className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm">Bonita Springs</span>
                        </div>
                      </div>
                    </div>

                    {/* Estero - Northeast */}
                    <div className="absolute top-1/3 right-1/4">
                      <div className="relative">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
                        <div className="absolute -top-8 -left-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm">Estero</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Area Coverage Circle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-green-300 rounded-full opacity-30"></div>
                    </div>
                  </div>
                </div>

                {/* Compass */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Main Office' : 'Oficina Principal'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Service Areas' : 'Áreas de Servicio'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas List & Stats */}
          <div className="order-1 lg:order-2">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-800 mb-1">{stat.value}</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Service Areas List */}
            <div className="space-y-4" data-testid="service-areas-list">
              {serviceAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-green-50 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-green-800 mb-1">{area.name}</h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          {language === 'en' ? `Population: ${area.population}` : `Población: ${area.population}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-semibold text-green-600">{area.distance}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {language === 'en' ? 'from office' : 'desde oficina'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-green-800 mb-1 sm:mb-2">
                    {language === 'en' ? 'Main Office Location' : 'Ubicación de Oficina Principal'}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-2 leading-relaxed">
                    Naples, FL 34102<br />
                    {language === 'en' 
                      ? 'Serving all surrounding communities' 
                      : 'Sirviendo todas las comunidades circundantes'
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {language === 'en'
                      ? 'Telehealth services available for all service areas'
                      : 'Servicios de telesalud disponibles para todas las áreas de servicio'
                    }
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

export default ServiceAreas;