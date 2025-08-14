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
      coordinates: [26.1420, -81.7948] as [number, number],
      isMainOffice: true
    },
    {
      name: 'Marco Island, FL', 
      population: '17,963',
      distance: language === 'en' ? '20 min drive' : '20 min en auto',
      coordinates: [25.9412, -81.7273] as [number, number],
      isMainOffice: false
    },
    {
      name: 'Bonita Springs, FL',
      population: '57,755', 
      distance: language === 'en' ? '25 min drive' : '25 min en auto',
      coordinates: [26.3398, -81.7787] as [number, number],
      isMainOffice: false
    },
    {
      name: 'Estero, FL',
      population: '36,939',
      distance: language === 'en' ? '30 min drive' : '30 min en auto',
      coordinates: [26.4376, -81.8067] as [number, number],
      isMainOffice: false
    }
  ];

  // Center coordinates for Southwest Florida view
  const mapCenter: [number, number] = [26.1420, -81.7948]; // Naples center

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
          {/* Real Google Maps Background */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-green-100">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
                
                {/* Google Maps Screenshot as Background */}
                <div className="absolute inset-0">
                  <img 
                    src="/attached_assets/Captura de pantalla 2025-08-14 204410_1755197073893.png" 
                    alt="Southwest Florida Map"
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  />
                </div>

                {/* City Markers positioned exactly over map locations */}
                <div className="absolute inset-0">
                  {/* Naples - Center (Main Office) - Based on map position */}
                  <div className="absolute" style={{top: '68%', left: '37%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full shadow-lg animate-pulse border-2 border-white"></div>
                      <div className="absolute -top-8 -left-8 whitespace-nowrap">
                        <span className="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md shadow-lg">
                          Naples ⭐
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Marco Island - Bottom area */}
                  <div className="absolute" style={{top: '88%', left: '40%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                      <div className="absolute -top-8 -left-12 whitespace-nowrap">
                        <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-lg">
                          Marco Island
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estero - North center area */}
                  <div className="absolute" style={{top: '36%', left: '38%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                      <div className="absolute -top-8 -left-6 whitespace-nowrap">
                        <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-lg">
                          Estero
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bonita Springs - Fort Myers area */}
                  <div className="absolute" style={{top: '28%', left: '25%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                      <div className="absolute -top-8 -left-10 whitespace-nowrap">
                        <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-lg">
                          Bonita Springs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Coverage Circle around Naples */}
                  <div className="absolute" style={{top: '68%', left: '37%', transform: 'translate(-50%, -50%)'}}>
                    <div className="w-48 h-48 sm:w-56 sm:h-56 border-3 border-green-500 rounded-full opacity-30 bg-green-200 bg-opacity-20 animate-pulse"></div>
                  </div>
                </div>

                {/* Compass */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                </div>

                {/* Distance Scale */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-white bg-opacity-90 rounded-lg shadow-lg px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <div className="w-8 h-0.5 bg-gray-500"></div>
                      <span>30 mi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
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